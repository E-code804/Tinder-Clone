"use client";
import { useUserId } from "@/app/context/UserIdContext";
import { useUser } from "@/app/hooks/useUserContext";
import { sendLike } from "@/app/utils/sendLike";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ReplayIcon from "@mui/icons-material/Replay";
import { IconButton } from "@mui/material";
import React from "react";
import "./styles.css";

const DiscoverActions = () => {
  const { state, dispatch } = useUser();
  const { userId } = useUserId();
  // TODO: Add undo logic to the backend
  const handleReplayClick = () => {
    dispatch({ type: "UNDO_CARD" });
  };

  const handleLeftClick = () => {
    const removeId = state.cards[state.cards.length - 1]._id;
    dispatch({ type: "REMOVE_CARD", payload: { userId: removeId.toString() } });
  };

  const handleRightClick = async () => {
    const removeId = state.cards[state.cards.length - 1]._id;
    dispatch({ type: "REMOVE_CARD", payload: { userId: removeId.toString() } });
    await sendLike(userId, removeId);
  };

  // Removed the super like and boost btns for simplicity.
  return (
    <div className="discoverButtons">
      <IconButton className="discoverButtons__replay" onClick={handleReplayClick}>
        <ReplayIcon fontSize="large" />
      </IconButton>
      <IconButton className="discoverButtons__left" onClick={handleLeftClick}>
        <CloseIcon fontSize="large" />
      </IconButton>
      <IconButton className="discoverButtons__right" onClick={handleRightClick}>
        <FavoriteIcon fontSize="large" />
      </IconButton>
    </div>
  );
};

export default DiscoverActions;
