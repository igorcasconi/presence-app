import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "A senha deve conter 8 caracteres" }),
    confirmPassword: z
      .string()
      .min(8, { message: "A senha deve conter 8 caracteres" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas devem ser iguais",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
