"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import { Input, Button, Select, Textarea } from "@/components";
import { createWorkout } from "@/firebase/database/workout";

import { WorkoutFormProps } from "@/shared/types/workout";
import { workoutSchema } from "@/schemas/workout";
import { optionsWorkoutType } from "@/constants/workout";

const CreateWorkout = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WorkoutFormProps>({
    defaultValues: {
      title: "",
      type: "",
      rest: "",
      repetition: "",
      sets: "",
      rhythm: "",
      observation: "",
      url: "",
      isActive: true,
    },
    resolver: zodResolver(workoutSchema),
  });

  const handleCreateWorkout = async (values: WorkoutFormProps) => {
    const uid = uuidv4();

    const payload = {
      title: values.title,
      type: values.type,
      rest: values.rest,
      repetition: values.repetition,
      sets: values.sets,
      rhythm: values.rhythm,
      observation: values.observation,
      url: values.url,
      isActive: values.isActive,
    } as WorkoutFormProps;
    const { error } = await createWorkout(uid, payload);

    if (!!error) {
      toast.error("Ocorreu um erro ao cadastrar o novo treino!");
      return;
    }

    toast.success("Treino criado com sucesso!");

    return router.push("/admin/workouts");
  };

  return (
    <div className="w-full h-full flex flex-col items-center md:max-w-[500px] m-auto px-4">
      <h1 className="text-white text-center font-semibold mt-5 mb-10 text-[24px]">
        Criar novo treino
      </h1>

      <form onSubmit={handleSubmit(handleCreateWorkout)} className="w-full">
        <div className="mb-5 w-full">
          <Input
            label="Título do treino"
            placeholder="Ex.: Pendurada"
            register={register}
            name="title"
            error={!!errors?.title?.message}
            message={errors.title?.message}
          />
        </div>

        <div className="mb-5 w-full">
          <Select
            label="Tipo de treino"
            placeholder="Tipo de treino"
            error={!!errors?.type?.message}
            message={errors.type?.message}
            options={optionsWorkoutType}
            register={register}
            name="type"
          />
        </div>

        <div className="mb-5 w-full">
          <Input
            label="Sets"
            placeholder="Ex.: 4x"
            register={register}
            name="sets"
            error={!!errors?.sets?.message}
            message={errors.sets?.message}
          />
        </div>

        <div className="mb-5 w-full">
          <div className="mb-5 w-full">
            <Input
              label="Repetição/Isometria/Tempo"
              placeholder="40 segundos"
              register={register}
              name="repetition"
              error={!!errors?.repetition?.message}
              message={errors.repetition?.message}
            />
          </div>
        </div>

        <div className="mb-5 w-full">
          <div className="mb-5 w-full">
            <Input
              label="Cadência"
              placeholder="3-2/1/2 3-1/2/1"
              register={register}
              name="rhythm"
              error={!!errors?.rhythm?.message}
              message={errors.rhythm?.message}
            />
          </div>
        </div>

        <div className="mb-5 w-full">
          <div className="mb-5 w-full">
            <Input
              label="Descanso"
              placeholder="No máximo 1 minuto"
              register={register}
              name="rest"
              error={!!errors?.rest?.message}
              message={errors.rest?.message}
            />
          </div>
        </div>

        <div className="mb-5 w-full">
          <div className="mb-5 w-full">
            <Input
              label="Url do video de exemplo"
              placeholder="https://www.youtube.com/...."
              register={register}
              name="url"
              error={!!errors?.rest?.message}
              message={errors.rest?.message}
            />
          </div>
        </div>

        <div className="mb-5 w-full">
          <div className="mb-5 w-full">
            <Textarea
              label="Observações"
              placeholder="Observações..."
              register={register}
              name="observation"
              error={!!errors?.observation?.message}
              message={errors.observation?.message}
            />
          </div>
        </div>

        <Button
          text="Criar treino"
          type="submit"
          loading={isSubmitting}
          className="mb-10"
        />
      </form>
    </div>
  );
};

export default CreateWorkout;
