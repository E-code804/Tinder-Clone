import BoltIcon from "@mui/icons-material/Bolt";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ReplayIcon from "@mui/icons-material/Replay";
import StarIcon from "@mui/icons-material/Star";
import { IconButton } from "@mui/material";
import React from "react";
import "./styles.css";

const DiscoverActions = () => {
  return (
    <div className="discoverButtons">
      <IconButton className="discoverButtons__replay">
        <ReplayIcon fontSize="large" />
      </IconButton>
      <IconButton className="discoverButtons__left">
        <CloseIcon fontSize="large" />
      </IconButton>
      <IconButton className="discoverButtons__star">
        <StarIcon fontSize="large" />
      </IconButton>
      <IconButton className="discoverButtons__right">
        <FavoriteIcon fontSize="large" />
      </IconButton>
      <IconButton className="discoverButtons__lightning">
        <BoltIcon fontSize="large" />
      </IconButton>
    </div>
  );
};

export default DiscoverActions;
