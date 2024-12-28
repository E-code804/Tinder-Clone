"use client";
import React, { useEffect, useState } from "react";
import TinderCard from "react-tinder-card";
import "./styles.css";

type Person = {
  name: string;
  image: string;
};

const TinderCards = () => {
  const [cards, setCards] = useState<Person[]>([
    {
      name: "Elon Musk",
      image:
        "https://hips.hearstapps.com/hmg-prod/images/elon-musk-gettyimages-2147789844-web-675b2c17301ea.jpg?crop=0.6666666666666666xw:1xh;center,top&resize=1200:*",
    },
    {
      name: "Jeff Bezos",
      image:
        "https://hips.hearstapps.com/hmg-prod/images/jeff-bezos-attends-the-lord-of-the-rings-the-rings-of-power-news-photo-1684851576.jpg?crop=1.00xw:0.864xh;0,0.0207xh&resize=360:*",
    },
  ]);

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
      setCards(json.users); // may need to force users to upload jpeg.
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
