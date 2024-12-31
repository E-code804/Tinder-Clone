"use client";

import { useMessage } from "@/app/hooks/useMessageContext";
import { useUser } from "@/app/hooks/useUserContext";
import { useState } from "react";
import "./styles.css";

const Chat = () => {
  const { state } = useUser();
  const { userId } = state;
  const { state: messageState, dispatch: messageDispatch } = useMessage(); // Add loading state for message in here
  const { chats, matchId } = messageState;
  const [message, setMessage] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/message/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: userId,
          receiver: matchId,
          message: message,
        }),
      });

      if (!response.ok) {
        console.log("Error");
      }

      const { newMessage } = await response.json();
      messageDispatch({ type: "ADD_CHAT", payload: { chat: newMessage } });
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setMessage("");
    }
  };

  // Look back at what should be displayed when a user enters this page, hasn't sent a message yet, hasn't clicked on someone, etc.
  return (
    <div className="chat">
      <div className="chat__display">
        {!chats ? (
          <p>No chats yet.</p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id.toString()}
              className={
                chat.sender.toString() === userId.toString()
                  ? "user__chat"
                  : "match__chat"
              }
            >
              {chat.message}
            </div>
          ))
        )}
      </div>
      <form className="chat__form">
        <input
          type="text"
          name="new__chat"
          id="new__chat"
          value={message}
          onChange={handleInputChange}
        />
        <button type="submit" className="send__chat__btn" onClick={handleSubmit}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
