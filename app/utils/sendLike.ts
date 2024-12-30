import { Types } from "mongoose";

export const sendLike = async (
  userId: Types.ObjectId,
  likedUserId: Types.ObjectId
) => {
  const response = await fetch(
    `http://localhost:3000/api/user/likes/sent/${userId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likedUserId }),
    }
  );

  if (!response.ok) {
    // Adjust error msg here
    console.log("Error has occurred");
  }

  alert("Like successfully sent");
};