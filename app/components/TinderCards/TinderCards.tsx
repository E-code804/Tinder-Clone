"use client";
import React, { useEffect, useState } from "react";
import TinderCard from "react-tinder-card";
import "./styles.css";

type Person = {
  name: string;
  image: string;
};

const TinderCards = () => {
  const [cards, setCards] = useState<Person[]>([]);

  const swiped = (direction: any, nameToDelete: string) => {
    // Eventually add the removed person to an array for undos.
    console.log(`removing: ${nameToDelete}, ${direction}`);
  };

  const outOfFrame = (name: string) => {
    console.log(name + " left the screen");
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch("/api/users");
      const json = await data.json();

      console.log(json.users);
      setCards(json.users); // may need to force users to upload jpeg. string starts with /9j/ for JPEG or iVBORw0K for PNG.
    };

    fetchData();
  }, []);

  return (
    <div className="tinderCards">
      <div className="tinderCards__cardContainer">
        {cards.map((card) => (
          <TinderCard
            className="swipe"
            key={card.name}
            preventSwipe={["up", "down"]}
            onSwipe={(dir) => swiped(dir, card.name)}
            onCardLeftScreen={() => outOfFrame(card.name)}
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
        ))}
      </div>
    </div>
  );
};

export default TinderCards;
