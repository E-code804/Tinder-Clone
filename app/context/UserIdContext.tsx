"use client";

import { Types } from "mongoose";
import { createContext, ReactNode, useContext, useState } from "react";

// Define the shape of the context
interface UserIdContextValue {
  userId: Types.ObjectId | null;
  setUserId: (userId: Types.ObjectId | null) => void;
}

// Create the context
const UserIdContext = createContext<UserIdContextValue | undefined>(undefined);

// Create a provider component
export function UserIdProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<Types.ObjectId | null>(null);

  return (
    <UserIdContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserIdContext.Provider>
  );
}

// Custom hook to use the context
export function useUserId() {
  const context = useContext(UserIdContext);
  if (!context) {
    throw new Error("useUserId must be used within a UserIdProvider");
  }
  return context;
}
