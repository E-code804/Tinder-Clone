"use client";
import { Types } from "mongoose";
import { createContext, ReactNode, useContext, useReducer, useState } from "react";
import { Action, State } from "../interfaces/UserInterfaces";

const initialState: State = {
  userId: new Types.ObjectId("67708034f8f82821ba418f98"),
  cards: [],
  undoCards: [],
};

export const UserContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export const userReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_CARDS":
      return { ...state, cards: action.payload, undoCards: [] };
    // REMOVE_USER is used when the user either likes or removes the current user they see
    case "REMOVE_CARD":
      const { userId } = action.payload;

      const updatedCards = state.cards.filter((card) => card._id !== userId);
      const removedCard = state.cards.find((card) => card._id === userId);

      return {
        ...state,
        cards: updatedCards,
        undoCards: removedCard ? [...state.undoCards, removedCard] : state.undoCards,
      };
    case "UNDO_CARD":
      if (state.undoCards.length === 0) {
        return state;
      }

      const undoUser = state.undoCards[state.undoCards.length - 1];
      const updatedUndoCards = state.undoCards.slice(0, -1);

      return {
        ...state,
        cards: [...state.cards, undoUser],
        undoCards: updatedUndoCards,
      };
    default:
      return state;
  }
};

export const UserConextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
