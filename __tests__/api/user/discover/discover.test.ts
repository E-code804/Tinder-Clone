import { GET } from "@/app/api/user/discover/[userId]/route";
import User from "@/app/db/models/User";
import { createNextRequest } from "@/app/utils/mockNextRequest"; // Mock NextRequest
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

describe("GET /api/user/:userId - Discover Users", () => {
  it("returns discoverable users successfully", async () => {
    // Mock user and discoverable profiles
    (User.findById as jest.Mock).mockResolvedValue({
      _id: testUser1._id,
      matches: [],
      sentLikes: [],
    });

    (User.find as jest.Mock).mockResolvedValue([testUser2]); // Users to discover

    const req = createNextRequest(`/api/user/${testUser1._id}`);
    const res = await GET(req, { params: { userId: testUser1._id } });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.users).toEqual([testUser2]);
  });

  it("returns 404 if user does not exist", async () => {
    (User.findById as jest.Mock).mockResolvedValue(null); // User not found

    const req = createNextRequest(`/api/user/nonexistent`);
    const res = await GET(req, { params: { userId: "nonexistent" } });

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe("No such user");
  });

  it("returns 200 with a message if no new users to discover", async () => {
    // Mock user with all users already seen
    (User.findById as jest.Mock).mockResolvedValue({
      _id: testUser1._id,
      matches: [testUser2._id],
      sentLikes: [],
    });

    (User.find as jest.Mock).mockResolvedValue([]); // No users left to discover

    const req = createNextRequest(`/api/user/${testUser1._id}`);
    const res = await GET(req, { params: { userId: testUser1._id } });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.message).toBe("No new users to discover");
  });

  it("returns 500 if database throws an error", async () => {
    (User.findById as jest.Mock).mockRejectedValue(new Error("DB Error"));

    const req = createNextRequest(`/api/user/${testUser1._id}`);
    const res = await GET(req, { params: { userId: testUser1._id } });

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Internal server error");
  });
});
