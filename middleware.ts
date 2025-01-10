import { decrypt } from "@/app/auth/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Protected and public routes
const protectedRoutes = ["/matches", "/", "/profile"];
const publicRoutes = ["/login", "/signup"];

export default async function middleware(req: NextRequest) {
  // Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // Decrypt the session from the cookie
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  // Redirect if accessing a protected route w/o auth
  console.log("Middleware", session?.userId);

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect logged-in users away from the public routes.
  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}
