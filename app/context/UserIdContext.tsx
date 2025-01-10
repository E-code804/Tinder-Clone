"use client";

import { Types } from "mongoose";
import { createContext, ReactNode, useContext, useState } from "react";

// Define the shape of the context
interface UserIdContextValue {
  userId: string | null;
  setUserId: (userId: string | null) => void;
}

// Create the context
const UserIdContext = createContext<UserIdContextValue | undefined>(undefined);

// Provider component
export function UserIdProvider({
  children,
  initialUserId,
}: {
  children: ReactNode;
  initialUserId: string | null;
}) {
  const [userId, setUserId] = useState<string | null>(initialUserId);

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
