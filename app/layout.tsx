import { decrypt } from "@/app/auth/session";
import { Types } from "mongoose";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { MessageContextProvider } from "./context/MessageContext";
import { UserContextProvider } from "./context/UserContext";
import { UserIdProvider } from "./context/UserIdContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tinder Clone",
  description: "Tinder Clone created by Erik Pfeffer",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read the session cookie
  const sessionCookie = (await cookies()).get("session")?.value;

  // Decrypt and extract userId (if session exists)
  const session = sessionCookie ? await decrypt(sessionCookie) : null;
  console.log(`session from root: ${session}`);
  const userId = session?.userId ? session.userId.toString() : null;
  console.log(`userId from root: ${userId}`);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MessageContextProvider>
          <UserContextProvider>
            <UserIdProvider initialUserId={userId}>{children}</UserIdProvider>
          </UserContextProvider>
        </MessageContextProvider>
      </body>
    </html>
  );
}
