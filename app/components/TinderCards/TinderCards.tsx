"use client";

import { useUser } from "@/app/hooks/useUserContext";
import { sendLike } from "@/app/utils/sendLike";
import { Types } from "mongoose";
import React, { useEffect, useState } from "react";
import TinderCard from "react-tinder-card";
import "./styles.css";

const TinderCards = () => {
  // const userId = new Types.ObjectId("67708034f8f82821ba418f98");
  const [loading, setLoading] = useState<Boolean>(true);
  const { state: userState, dispatch: userDispatch } = useUser();

  const swiped = async (direction: any, id: Types.ObjectId) => {
    userDispatch({ type: "REMOVE_CARD", payload: { userId: id } });
    console.log(`removing: ${id}, ${direction}`);

    if (direction === "right") {
      await sendLike(userState.userId, id);
    }
  };

  const outOfFrame = (id: Types.ObjectId) => {
    console.log(id + " left the screen");
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log(userState.userId.toString());

      const response = await fetch(`/api/user/discover/${userState.userId}`);

      if (!response.ok) {
        // Adjust error msg here
        console.log("Error has occurred");
      }

      const json = await response.json();
      console.log(json.users);

      setLoading(false);
      userDispatch({ type: "SET_CARDS", payload: json.users }); // may need to force users to upload jpeg. string starts with /9j/ for JPEG or iVBORw0K for PNG.
    };

    fetchData();
  }, []);

  return (
    <div className="tinderCards">
      <div className="tinderCards__cardContainer">
        {loading ? (
          <p>Loading new users</p>
        ) : userState.cards.length === 0 ? (
          <p>No new users for you to discover.</p>
        ) : (
          userState.cards.map((card) => (
            <TinderCard
              className="swipe"
              key={card._id.toString()}
              preventSwipe={["up", "down"]}
              onSwipe={(dir) => swiped(dir, card._id)}
              onCardLeftScreen={() => outOfFrame(card._id)}
            >
              <div
                className="card"
                style={{
                  backgroundImage: `url(data:image/jpeg;base64,${card.image})`,
                }}
              >
                <h3>{card.name}</h3>
              </div>
            </TinderCard>
          ))
        )}
      </div>
    </div>
  );
};

export default TinderCards;
