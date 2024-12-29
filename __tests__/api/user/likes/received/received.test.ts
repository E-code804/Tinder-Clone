import { GET, POST } from "@/app/api/user/likes/received/[userId]/route";
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

describe("GET /api/user/likes/received/:userId", () => {
  it("returns received likes for a valid user", async () => {
    (User.findById as jest.Mock).mockResolvedValue({
      _id: testUser1._id,
      receivedLikes: [testUser2._id],
    });

    const req = createNextRequest(`/api/user/likes/received/${testUser1._id}`);
    const res = await GET(req, { params: { userId: testUser1._id } });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.userReceivedLikes).toEqual({
      _id: testUser1._id,
      receivedLikes: [testUser2._id],
    });
  });

  it("returns 404 if user is not found", async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    const req = createNextRequest(`/api/user/likes/received/nonexistent`);
    const res = await GET(req, { params: { userId: "nonexistent" } });

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.message).toBe("User not found.");
  });

  it("returns 500 on database error", async () => {
    (User.findById as jest.Mock).mockRejectedValue(new Error("DB Error"));

    const req = createNextRequest(`/api/user/likes/received/${testUser1._id}`);
    const res = await GET(req, { params: { userId: testUser1._id } });

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe("Internal server error.");
  });
});

describe("POST /api/user/likes/received/:userId", () => {
  it("matches users successfully", async () => {
    (User.updateOne as jest.Mock).mockResolvedValue({ modifiedCount: 1 });

    const req = createNextRequest(
      `/api/user/likes/received/${testUser1._id}`,
      "POST"
    );

    req.json = jest.fn().mockResolvedValue({ acceptedUserId: testUser2._id });

    const res = await POST(req, { params: { userId: testUser1._id } });

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.message).toBe("Successfully matched!");
  });

  it("returns 404 if unable to remove from sent likes", async () => {
    (User.updateOne as jest.Mock)
      .mockResolvedValueOnce({ modifiedCount: 0 }) // Simulate failure
      .mockResolvedValue({ modifiedCount: 1 });

    const req = createNextRequest(
      `/api/user/likes/received/${testUser1._id}`,
      "POST"
    );

    req.json = jest.fn().mockResolvedValue({ acceptedUserId: testUser2._id });

    const res = await POST(req, { params: { userId: testUser1._id } });

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.message).toBe("Could not remove user from likes sent.");
  });

  it("returns 404 if unable to remove from received likes", async () => {
    (User.updateOne as jest.Mock)
      .mockResolvedValueOnce({ modifiedCount: 1 })
      .mockResolvedValueOnce({ modifiedCount: 0 }); // Simulate failure

    const req = createNextRequest(
      `/api/user/likes/received/${testUser1._id}`,
      "POST"
    );

    req.json = jest.fn().mockResolvedValue({ acceptedUserId: testUser2._id });

    const res = await POST(req, { params: { userId: testUser1._id } });

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.message).toBe("Could not remove accepted user from received likes.");
  });

  it("returns 500 if database throws an error", async () => {
    (User.updateOne as jest.Mock).mockRejectedValue(new Error("DB Error"));

    const req = createNextRequest(
      `/api/user/likes/received/${testUser1._id}`,
      "POST"
    );

    req.json = jest.fn().mockResolvedValue({ acceptedUserId: testUser2._id });

    const res = await POST(req, { params: { userId: testUser1._id } });

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toContain("Error occurred.");
  });
});
