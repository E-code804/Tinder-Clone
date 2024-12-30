import { Types } from "mongoose";

export interface UserParams {
  userId: string;
}

export interface Person {
  _id: Types.ObjectId;
  name: string;
  image: string;
}

export type State = { userId: Types.ObjectId; cards: Person[]; undoCards: Person[] };

export type Action =
  | { type: "SET_CARDS"; payload: Person[] }
  | { type: "REMOVE_CARD"; payload: { userId: Types.ObjectId } }
  | { type: "UNDO_CARD" };
