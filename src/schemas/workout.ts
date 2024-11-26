import { z } from "zod";

export const workoutSchema = z.object({
  title: z.string(),
  type: z.string(),
  sets: z.string().optional(),
  rhythm: z.string().optional(),
  rest: z.string().optional(),
  repetition: z.string().optional(),
  observation: z.string().optional(),
  url: z.string().url().optional(),
  isActive: z.boolean().optional(),
});
