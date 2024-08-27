import { z } from "zod";

export const modalitySchema = z.object({
  name: z.string(),
});
