"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { Input, Button, Select, Textarea, Loader } from "@/components";
import { createWorkout, getWorkoutData } from "@/firebase/database/workout";

import { WorkoutFormProps } from "@/shared/types/workout";
import { workoutSchema } from "@/schemas/workout";
import { optionsWorkoutType } from "@/constants/workout";

const CreateWorkout = () => {
  const router = useRouter();
  const params = useParams<{ uid: string }>();
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
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
      position: "",
    },
    resolver: zodResolver(workoutSchema),
  });

  const handleCreateWorkout = async (values: WorkoutFormProps) => {
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
      position: values.position,
    } as WorkoutFormProps;
    const { error } = await createWorkout(params.uid, payload);

    if (!!error) {
      toast.error("Ocorreu um erro ao editar o treino!");
      return;
    }

    toast.success("Treino editado com sucesso!");

    return router.push(`/admin/workouts/${params.uid}`);
  };

  const handleGetWorkoutData = async () => {
    try {
      const workoutData = await getWorkoutData(params.uid);

      reset({
        title: workoutData?.title,
        type: workoutData?.type,
        rest: workoutData?.rest,
        repetition: workoutData?.repetition,
        sets: workoutData?.sets,
        rhythm: workoutData?.rhythm,
        observation: workoutData?.observation,
        url: workoutData?.url,
        isActive: workoutData?.isActive,
        position: workoutData?.position,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetWorkoutData();

    // eslint-disable-next-line
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center md:max-w-[500px] m-auto px-4">
      <h1 className="text-white text-center font-semibold mt-5 mb-10 text-[24px]">
        Editar treino
      </h1>

      {isLoading ? (
        <div className="justify-center mt-[50%]">
          <Loader />
        </div>
      ) : (
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
              <Input
                label="Posição de exibição na lista"
                placeholder="ex.: 1"
                register={register}
                name="position"
                type="number"
                error={!!errors?.position?.message}
                message={errors.position?.message}
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
            text="Editar treino"
            type="submit"
            loading={isSubmitting}
            className="mb-10"
          />
        </form>
      )}
    </div>
  );
};

export default CreateWorkout;
