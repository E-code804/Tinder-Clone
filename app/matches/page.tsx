import React from "react";
import Chat from "../components/Chat/Chat";
import MatchList from "../components/MatchList/MatchList";
import "./styles.css";

const page = () => {
  return (
    <div className="matches__page">
      <MatchList />
      <Chat />
    </div>
  );
};

export default page;
