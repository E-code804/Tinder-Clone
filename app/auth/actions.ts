"use server";

import {
  FormState,
  LoginFormSchema,
  SignUpFormSchema,
} from "@/app/auth/definitions";
import { createSession, deleteSession } from "@/app/auth/session";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function logout() {
  const deleteSessionResult = await deleteSession();

  if (deleteSessionResult.success) {
    return { redirectTo: "/login" };
  }
  return { message: "Deletion failed." };
}

export async function login(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Validate fields
  const validationResult = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  // 2. Login user
  try {
    const response = await fetch(`${baseUrl}/api/auth`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    // Cases for specific error codes.
    if (!response.ok) {
      return {
        errors: { message: result.message },
      };
    }

    // 3. Create session
    const sessionResult = await createSession(result.id);

    if (sessionResult.success) {
      console.log("Successful login", result.id);

      return { redirectTo: "/", id: result.id };
    }

    return {
      message: "Login successful, but session could not be created.",
    };
  } catch (error: any) {
    console.error("API Error:", error);
    return {
      errors: { message: "Something went wrong. Try again later." },
    };
  }
}

export async function signup(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Validate fields
  const validationResult = SignUpFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    image: formData.get("image"),
  });

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  // 2. Create user
  try {
    const response = await fetch(`${baseUrl}/api/user`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    // Cases for specific error codes.
    if (!response.ok) {
      if (response.status === 409) {
        return { errors: { email: ["User with this email already exists."] } };
      }
      return {
        errors: { message: "Signup failed." },
      };
    }

    // 3. Create session
    const sessionResult = await createSession(result.id);

    if (sessionResult.success) {
      console.log("Successful signup", result.id);
      return { redirectTo: "/", id: result.id };
    }

    return {
      message: "Signup successful, but session could not be created.",
    };
  } catch (error: any) {
    console.error("API Error:", error);
    return {
      errors: { message: "Something went wrong. Try again later." },
    };
  }
}
