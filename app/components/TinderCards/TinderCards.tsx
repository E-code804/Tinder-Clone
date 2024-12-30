"use client";

import { useUser } from "@/app/hooks/useUserContext";
import { Person } from "@/app/interfaces/UserInterfaces";
import { sendLike } from "@/app/utils/sendLike";
import { Types } from "mongoose";
import React, { useEffect, useState } from "react";
import TinderCard from "react-tinder-card";
import "./styles.css";

const TinderCards = () => {
  const userId = new Types.ObjectId("67708034f8f82821ba418f98");
  const [loading, setLoading] = useState<Boolean>(true);
  const { state, dispatch } = useUser();

  const swiped = async (direction: any, id: Types.ObjectId) => {
    // Eventually add the removed person to an array for undos.
    console.log(`removing: ${id}, ${direction}`);
    if (direction === "right") {
      await sendLike(userId, id);
    }

    dispatch({ type: "REMOVE_CARD", payload: { userId: id } });
  };

  const outOfFrame = (id: Types.ObjectId) => {
    console.log(id + " left the screen");
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/user/discover/${userId}`);

      if (!response.ok) {
        // Adjust error msg here
        console.log("Error has occurred");
      }
      const json = await response.json();

      setLoading(false);
      dispatch({ type: "SET_CARDS", payload: json.users }); // may need to force users to upload jpeg. string starts with /9j/ for JPEG or iVBORw0K for PNG.
    };

    fetchData();
  }, []);

  return (
    <div className="tinderCards">
      <div className="tinderCards__cardContainer">
        {loading ? (
          <p>Loading new users</p>
        ) : state.cards.length === 0 ? (
          <p>No new users for you to discover.</p>
        ) : (
          state.cards.map((card) => (
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
