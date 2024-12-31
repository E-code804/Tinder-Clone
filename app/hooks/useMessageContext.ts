import { MessageContext } from "@/app/context/MessageContext";
import { useContext } from "react";

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useUser must be used within a MessageContextProvider");
  }
  return context;
};
