import { z } from "zod";

export const workoutSchema = z.object({
  title: z.string(),
  type: z.string(),
  sets: z.string().optional(),
  rhythm: z.string().optional(),
  rest: z.string().optional(),
  repetition: z.string().optional(),
  observation: z.string().optional(),
  url: z.string().optional(),
  isActive: z.boolean().optional(),
  position: z.string().optional(),
});
