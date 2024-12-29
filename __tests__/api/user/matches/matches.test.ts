import { GET } from "@/app/api/user/matches/[userId]/route";
import User from "@/app/db/models/User";
import { createNextRequest } from "@/app/utils/mockNextRequest";
import { testUser1, testUser2 } from "@/app/utils/testUsers";

// Mock DB connection and User model
jest.mock("@/app/db/connect", () => jest.fn());
jest.mock("@/app/db/models/User");

beforeAll(async () => {
  await User.deleteOne({ _id: testUser1._id });
  await User.deleteOne({ _id: testUser2._id });
  await User.create(testUser1);
  await User.create(testUser2);
});

describe("GET /api/user/matches/:userId", () => {
  it("returns matches for a valid user", async () => {
    (User.findById as jest.Mock).mockResolvedValue({
      _id: testUser1._id,
      matches: [testUser2._id],
    });

    const req = createNextRequest(`/api/user/matches/${testUser1._id}`);
    const res = await GET(req, { params: { userId: testUser1._id } });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.userMatches).toEqual({
      _id: testUser1._id,
      matches: [testUser2._id],
    });
  });

  it("returns 404 if user is not found", async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    const req = createNextRequest(`/api/user/matches/nonexistent`);
    const res = await GET(req, { params: { userId: "nonexistent" } });

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.message).toBe("User not found.");
  });

  it("returns 500 if database throws an error", async () => {
    (User.findById as jest.Mock).mockRejectedValue(new Error("DB Error"));

    const req = createNextRequest(`/api/user/matches/${testUser1._id}`);
    const res = await GET(req, { params: { userId: testUser1._id } });

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe("Internal server error.");
  });
});
