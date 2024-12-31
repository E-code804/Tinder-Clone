"use client";

import { useMessage } from "@/app/hooks/useMessageContext";
import { useState } from "react";
import "./styles.css";

const Chat = () => {
  const userId = "67708034f8f82821ba418f98";
  const { state: messageState, dispatch: messageDispatch } = useMessage(); // Add loading state for message in here
  const { chats } = messageState;
  const [message, setMessage] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // TODO: Implement below
    //messageDispatch({type: "ADD_CHAT", payload: {chat:message}})
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
                chat.sender.toString() === userId ? "user__chat" : "match__chat"
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
