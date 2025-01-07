import { z } from "zod";

export const SignUpFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
  image: z
    .instanceof(File)
    .refine((file) => file instanceof File, {
      message: "Image must be a valid file.",
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Image size must be under 5MB.",
    })
    .refine((file) => ["image/jpeg"].includes(file.type), {
      message: "Only JPEG images are allowed.",
    }),
});

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        image?: string[];
      };
      message?: string;
    }
  | undefined;
