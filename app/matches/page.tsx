import React from "react";
import Chat from "../components/Chat/Chat";
import Header from "../components/Header/Header";
import MatchList from "../components/MatchList/MatchList";
import "./styles.css";

const page = () => {
  return (
    <div className="matches__page">
      <Header />
      <div className="matches__display">
        <MatchList />
        <Chat />
      </div>
    </div>
  );
};

export default page;
