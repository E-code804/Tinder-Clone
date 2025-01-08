"use server";

import { FormState, SignUpFormSchema } from "@/app/auth/definitions";
import { createSession } from "@/app/auth/session";

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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
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
      return { redirectTo: "/" };
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
