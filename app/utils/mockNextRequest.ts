import { NextRequest } from "next/server";

// Helper function to mock NextRequest
export function createNextRequest(url: string, method: string = "GET") {
  const request = new NextRequest(new URL(url, "http://localhost"));
  return request;
}
