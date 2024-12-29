import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ReplayIcon from "@mui/icons-material/Replay";
import { IconButton } from "@mui/material";
import React from "react";
import "./styles.css";

const DiscoverActions = () => {
  // Removed the super like and boost btns for simplicity.
  return (
    <div className="discoverButtons">
      <IconButton className="discoverButtons__replay">
        <ReplayIcon fontSize="large" />
      </IconButton>
      <IconButton className="discoverButtons__left">
        <CloseIcon fontSize="large" />
      </IconButton>
      <IconButton className="discoverButtons__right">
        <FavoriteIcon fontSize="large" />
      </IconButton>
    </div>
  );
};

export default DiscoverActions;
