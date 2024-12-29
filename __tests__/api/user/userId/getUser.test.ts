import { GET } from "@/app/api/user/[userId]/route";
import User from "@/app/db/models/User";
import { createNextRequest } from "@/app/utils/mockNextRequest"; // Import mock helper
import { testUser1 } from "@/app/utils/testUsers";

// Mock DB connection and User model
jest.mock("@/app/db/connect", () => jest.fn());
jest.mock("@/app/db/models/User");

beforeAll(async () => {
  await User.deleteOne({ _id: testUser1._id });
  await User.create(testUser1);
});

describe("Testing: /api/user/:userId", () => {
  it("fetches the user successfully", async () => {
    (User.findById as jest.Mock).mockResolvedValue(testUser1);

    const req = createNextRequest(`/api/user/${testUser1._id}`);
    const result = await GET(req, { params: { userId: testUser1._id } });

    expect(result.status).toBe(200);
    const json = await result.json();
    expect(json.user).toEqual(testUser1);
  });

  it("returns 404 if user is not found", async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    const req = createNextRequest(`/api/user/nonexistent123`);
    const result = await GET(req, { params: { userId: "nonexistent123" } });

    expect(result.status).toBe(404);
    const json = await result.json();
    expect(json.error).toBe("No such user");
  });

  it("returns 500 if database throws an error", async () => {
    (User.findById as jest.Mock).mockRejectedValue(new Error("DB Error"));

    const req = createNextRequest(`/api/user/500error`);
    const result = await GET(req, { params: { userId: "500error" } });

    expect(result.status).toBe(500);
    const json = await result.json();
    expect(json.error).toBe("Internal server error");
  });
});
