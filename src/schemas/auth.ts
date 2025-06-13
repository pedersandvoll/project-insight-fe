import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("This is not a valid email"),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginFormSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("This is not a valid email"),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type RegisterFormSchema = z.infer<typeof registerSchema>;
