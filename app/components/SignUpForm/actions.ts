"use server";

import { FormState, SignUpFormSchema } from "@/app/utils/definitions";

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

    // Will need to generate cases for specific error codes.
    if (!response.ok) {
      return {
        errors: result.errors || { message: ["Signup failed."] },
      };
    }

    return {
      message: "Signup successful!",
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      message: "Something went wrong. Try again later.",
    };
  }
  // 3. Create session
}
