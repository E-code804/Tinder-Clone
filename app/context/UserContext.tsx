"use client";
import { Types } from "mongoose";
import { createContext, ReactNode, useReducer } from "react";
import { UserContextAction, UserContextState } from "../interfaces/UserInterfaces";

const initialState: UserContextState = {
  userId: new Types.ObjectId("67708599f8f82821ba418f9c"),
  cards: [],
  undoCards: [],
};

export const UserContext = createContext<{
  state: UserContextState;
  dispatch: React.Dispatch<UserContextAction>;
} | null>(null);

export const userReducer = (state: UserContextState, action: UserContextAction) => {
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

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
