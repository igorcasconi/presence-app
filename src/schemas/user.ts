import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(1, { message: "Necessário preencher este campo!" }),
    lastname: z
      .string()
      .min(1, { message: "Necessário preencher este campo!" }),
    email: z.string().email({ message: "e-mail inválido" }),
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

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const editUserSchema = z.object({
  name: z.string(),
});
