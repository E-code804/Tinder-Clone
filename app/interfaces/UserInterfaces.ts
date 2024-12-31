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
  userId: Types.ObjectId;
  cards: Person[];
  undoCards: Person[];
};

export type UserContextAction =
  | { type: "SET_CARDS"; payload: Person[] }
  | { type: "REMOVE_CARD"; payload: { userId: Types.ObjectId } }
  | { type: "UNDO_CARD" };

export type MessageContextState = {
  chats: ChatType[];
};

export type MessageContextAction =
  | { type: "SET_CHATS"; payload: ChatType[] }
  | { type: "ADD_CHAT"; payload: { chat: ChatType } };
