"use client";
import { Types } from "mongoose";
import { createContext, ReactNode, useReducer } from "react";
import {
  MessageContextAction,
  MessageContextState,
} from "../interfaces/UserInterfaces";

const initialMessageState: MessageContextState = {
  chats: [],
  matchId: new Types.ObjectId(),
};

export const MessageContext = createContext<{
  state: MessageContextState;
  dispatch: React.Dispatch<MessageContextAction>;
} | null>(null);

export const userReducer = (
  state: MessageContextState,
  action: MessageContextAction
) => {
  switch (action.type) {
    case "SET_CHATS":
      const { chats, matchId } = action.payload;
      return { chats, matchId };
    case "ADD_CHAT":
      return { ...state, chats: [...state.chats, action.payload.chat] };
    default:
      return state;
  }
};

export const MessageConextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, initialMessageState);

  return (
    <MessageContext.Provider value={{ state, dispatch }}>
      {children}
    </MessageContext.Provider>
  );
};
