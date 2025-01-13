"use client";

import { useUserId } from "@/app/context/UserIdContext";
import { useMessage } from "@/app/hooks/useMessageContext";
import { Person } from "@/app/interfaces/UserInterfaces";
import { Types } from "mongoose";
import React, { useEffect, useState } from "react";
import "./styles.css";

const MatchList = () => {
  const [matchedUsers, setMatchedUsers] = useState<Person[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const { userId } = useUserId();
  const [clickedMatchId, setclickedMatchId] = useState<Types.ObjectId>(
    new Types.ObjectId()
  );
  const { dispatch: messageDispatch } = useMessage();

  const getChats = (matchId: Types.ObjectId) => {
    console.log(`Loading chat between ${userId} and ${matchId}`);
    setclickedMatchId(matchId);
  };

  useEffect(() => {
    const fetchMatchedUsers = async () => {
      const response = await fetch(`/api/user/matches/${userId}`);

      if (!response.ok) {
        // Adjust error msg here
        console.log("Error has occurred");
      }

      const json = await response.json();
      console.log(json);

      setLoading(false);
      setMatchedUsers(json.matchedUsers);
    };
    fetchMatchedUsers();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(
        `/api/message/retrieve?sender=${userId}&receiver=${clickedMatchId}`
      );

      if (!response.ok) {
        console.log("Error occurred");
      }

      const json = await response.json();
      messageDispatch({
        type: "SET_CHATS",
        payload: { chats: json.messages, matchId: clickedMatchId },
      });
    };

    fetchMessages();
  }, [clickedMatchId]);

  return (
    <div className="matchList">
      {loading ? (
        <p>Loading Users</p>
      ) : !matchedUsers || matchedUsers.length === 0 ? (
        <p>No matches</p>
      ) : (
        matchedUsers?.map((user) => (
          <div
            key={user._id.toString()}
            className={`matchedUser ${clickedMatchId === user._id ? "clicked" : ""}`}
            onClick={() => getChats(user._id)}
          >
            <img src={`data:image/jpeg;base64,${user.image}`} /> <h1>{user.name}</h1>
          </div>
        ))
      )}
    </div>
  );
};

export default MatchList;
