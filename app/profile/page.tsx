"use client";
import React, { useEffect, useState } from "react";
import { logout } from "../auth/actions";
import Header from "../components/Header/Header";
import { useUserId } from "../context/UserIdContext";
import "./styles.css";

const page = () => {
  const [imgLink, setImgLink] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const { userId } = useUserId();

  const handleClick = async () => {
    const result = await logout();

    if (result.redirectTo) {
      window.location.href = result.redirectTo;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/api/user/${userId}`);

      if (!response.ok) {
        // Adjust error msg here
        console.log("Error has occurred");
        setLoading(false); // Some error msg too
      }

      const json = await response.json();
      console.log(json.user);

      setImgLink(json.user.image);
      setUsername(json.user.name);
      setLoading(false);
    };

    setLoading(true);
    fetchUser();
  }, []);

  return (
    <div>
      <Header />
      <div className="user__info">
        {loading ? (
          <h1 className="user__info__loading">Loading user information...</h1>
        ) : (
          <div className="user__info">
            <img
              className="user__info__image"
              src={`data:image/jpeg;base64,${imgLink}`}
              alt="User image"
            />
            <h1 className="user__info__username">{username}</h1>
            <button className="user__info__logout" onClick={handleClick}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
