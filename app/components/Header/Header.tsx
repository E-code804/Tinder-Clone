"use client";
import ForumIcon from "@mui/icons-material/Forum";
import PersonIcon from "@mui/icons-material/Person";
import { IconButton } from "@mui/material";
import Link from "next/link";
import React from "react";
import "./styles.css";

const Header = () => {
  return (
    <div className="header">
      <IconButton>
        <PersonIcon fontSize="large" className="header__icon" />
      </IconButton>

      <Link href="/">
        <img
          className="header__logo header__icon"
          src="https://1000logos.net/wp-content/uploads/2018/07/Tinder-logo-1536x864.png"
          alt="tinder logo"
        />
      </Link>

      <Link href="matches">
        <IconButton>
          <ForumIcon fontSize="large" className="header__icon" />
        </IconButton>
      </Link>
    </div>
  );
};

export default Header;
