"use client";

import { useUser } from "@/app/hooks/useUserContext";
import { Person } from "@/app/interfaces/UserInterfaces";
import React, { useEffect, useState } from "react";

const MatchList = () => {
  const [matchedUsers, setMatchedUsers] = useState<Person[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const { state, dispatch } = useUser();
  const { userId } = state;

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

  return (
    <div>
      {loading ? (
        <p>Loading Users</p>
      ) : (
        matchedUsers.map((user) => (
          <div key={user._id.toString()}>
            <img src={`data:image/jpeg;base64,${user.image}`} /> <h1>{user.name}</h1>
          </div>
        ))
      )}
    </div>
  );
};

export default MatchList;
