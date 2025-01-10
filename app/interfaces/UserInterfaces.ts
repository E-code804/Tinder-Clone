import { Types } from "mongoose";

export interface UserParams {
  userId: string;
}

export interface Person {
  _id: Types.ObjectId;
  name: string;
  image: string;
}

export interface ChatType {
  _id: Types.ObjectId;
  sender: Types.ObjectId;
  message: string;
  createdAt: Date;
}

export type UserContextState = {
  cards: Person[];
  undoCards: Person[];
};

// Define the shape of the context
interface UserIdContextValue {
  userId: string | null;
  setUserId: (userId: string | null) => void;
}

export type UserContextAction =
  | { type: "SET_CARDS"; payload: Person[] }
  | { type: "REMOVE_CARD"; payload: { userId: string } }
  | { type: "UNDO_CARD" }
  | { type: "SET_USERID"; payload: { userId: string } };

export type MessageContextState = {
  chats: ChatType[];
  matchId: Types.ObjectId;
};

export type MessageContextAction =
  | { type: "SET_CHATS"; payload: { chats: ChatType[]; matchId: Types.ObjectId } } // matchId tells Chat.tsx who the receiver is.
  | { type: "ADD_CHAT"; payload: { chat: ChatType } };
