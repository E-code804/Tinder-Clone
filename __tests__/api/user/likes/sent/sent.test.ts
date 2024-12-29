import { POST } from "@/app/api/user/likes/sent/[userId]/route";
import User from "@/app/db/models/User";
import { createNextRequest } from "@/app/utils/mockNextRequest";
import { testUser1, testUser2 } from "@/app/utils/testUsers";

// Mock DB connection and User model
jest.mock("@/app/db/connect", () => jest.fn());
jest.mock("@/app/db/models/User");

beforeEach(async () => {
  await User.deleteOne({ _id: testUser1._id });
  await User.deleteOne({ _id: testUser2._id });
  await User.create(testUser1);
  await User.create(testUser2);
});

describe("POST /api/user/likes/sent/:userId", () => {
  it("sends a like successfully", async () => {
    (User.findById as jest.Mock).mockResolvedValue({
      _id: testUser2._id,
      sentLikes: [],
    });

    (User.updateOne as jest.Mock).mockResolvedValue({ modifiedCount: 1 });

    const req = createNextRequest(`/api/user/likes/sent/${testUser1._id}`, "POST");

    req.json = jest.fn().mockResolvedValue({ likedUserId: testUser2._id });

    const res = await POST(req, { params: { userId: testUser1._id } });

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.message).toBe("Successfully registered like.");
  });

  it("matches users if a match is found", async () => {
    (User.findById as jest.Mock).mockResolvedValue({
      _id: testUser2._id,
      sentLikes: [testUser1._id],
    });

    (User.updateOne as jest.Mock).mockResolvedValue({ modifiedCount: 1 });

    const req = createNextRequest(`/api/user/likes/sent/${testUser1._id}`, "POST");
    req.json = jest.fn().mockResolvedValue({ likedUserId: testUser2._id });

    const res = await POST(req, { params: { userId: testUser1._id } });

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.message).toBe("Successfully matched!");
  });

  it("returns 404 if liked user is not found", async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    const req = createNextRequest(`/api/user/likes/sent/${testUser1._id}`, "POST");
    req.json = jest.fn().mockResolvedValue({ likedUserId: "invalidUser" });

    const res = await POST(req, { params: { userId: testUser1._id } });

    expect(res.status).toBe(404);
  });

  it("returns 404 if unable to remove from sentLikes during match", async () => {
    (User.findById as jest.Mock).mockResolvedValue({
      _id: testUser2._id,
      sentLikes: [testUser1._id],
    });

    (User.updateOne as jest.Mock)
      .mockResolvedValueOnce({ modifiedCount: 0 }) // Failed to remove from sentLikes
      .mockResolvedValue({ modifiedCount: 1 });

    const req = createNextRequest(`/api/user/likes/sent/${testUser1._id}`, "POST");
    req.json = jest.fn().mockResolvedValue({ likedUserId: testUser2._id });

    const res = await POST(req, { params: { userId: testUser1._id } });

    expect(res.status).toBe(404);
  });

  it("returns 404 if unable to update matches list", async () => {
    (User.findById as jest.Mock).mockResolvedValue({
      _id: testUser2._id,
      sentLikes: [testUser1._id],
    });

    (User.updateOne as jest.Mock)
      .mockResolvedValueOnce({ modifiedCount: 1 })
      .mockResolvedValueOnce({ modifiedCount: 0 }); // Failed to update matches

    const req = createNextRequest(`/api/user/likes/sent/${testUser1._id}`, "POST");
    req.json = jest.fn().mockResolvedValue({ likedUserId: testUser2._id });

    const res = await POST(req, { params: { userId: testUser1._id } });

    expect(res.status).toBe(404);
  });

  it("returns 500 if database throws an error", async () => {
    (User.findById as jest.Mock).mockRejectedValue(new Error("DB Error"));

    const req = createNextRequest(`/api/user/likes/sent/${testUser1._id}`, "POST");
    req.json = jest.fn().mockResolvedValue({ likedUserId: testUser2._id });

    const res = await POST(req, { params: { userId: testUser1._id } });

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toContain("Error occurred.");
  });
});
