import { z } from "zod";

const requiredFieldMessage = "Campo obrigatório";

export const lessonSchema = z
  .object({
    time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Hora inválida"),
    modality: z.string().min(1, { message: requiredFieldMessage }),
    weekDays: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
    teacher: z.string().min(1, { message: requiredFieldMessage }),
    uid: z.string().optional(),
    date: z.string().optional(),
    isSingleLesson: z.boolean(),
  })
  .refine(
    (data) => {
      if (data?.isSingleLesson && !data.date) {
        return false;
      }

      return true;
    },
    {
      message: "Campo Data é obrigatório",
      path: ["date"],
    }
  )
  .refine(
    (data) => {
      if (!data?.isSingleLesson && !data.weekDays?.length) {
        return false;
      }

      return true;
    },
    {
      message: "Campo Dias da semana é obrigatório",
      path: ["weekDays"],
    }
  );
