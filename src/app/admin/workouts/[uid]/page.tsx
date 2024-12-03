"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button, Loader, Modal } from "@/components";
import { deleteWorkout, getWorkoutData } from "@/firebase/database/workout";

import { WorkoutProps } from "@/shared/types/workout";
import { toast } from "react-toastify";
import { optionsWorkoutType } from "@/constants/workout";

const WorkoutDetail = () => {
  const [workoutDetailData, setWorkoutDetailData] = useState<
    WorkoutProps | null | undefined
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams<{ uid: string }>();
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);

  const loadWorkouts = async () => {
    try {
      const workoutData = await getWorkoutData(params.uid);

      setWorkoutDetailData(workoutData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWorkout = async () => {
    try {
      await deleteWorkout(params.uid);
      toast.success("Treino excluído com sucesso!");
      router.push("/admin/workouts");
    } catch (error) {
      toast.error("Ocorreu um erro ao deletar treino!");
    }
  };

  const handleEditWorkout = () => {
    router.push(`/admin/workouts/edit/${params.uid}`);
  };

  useEffect(() => {
    loadWorkouts();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="w-full h-full pt-4 px-4 md:max-w-[500px] m-auto flex flex-col items-center">
      {isLoading ? (
        <div className="justify-center mt-[50%]">
          <Loader />
        </div>
      ) : (
        <>
          {isModalVisible && (
            <Modal
              title="Excluir treino?"
              message="Realmente deseja excluir este treino?"
              confirmButtonLabel="Excluir"
              cancelButtonLabel="Cancelar"
              onConfirmButton={handleDeleteWorkout}
              onCancelButton={() => setModalVisible(false)}
              onCloseModal={() => setModalVisible(false)}
            />
          )}
          <div className="flex w-full justify-end">
            <Button
              text="Excluir"
              className="!bg-red-500 h-8 max-w-24 ml-2"
              textStyle="text-xs"
              onClick={() => setModalVisible(true)}
            />

            <Button
              text="Editar"
              className="!bg-blue-500 h-8 max-w-24 ml-2"
              textStyle="text-xs"
              onClick={handleEditWorkout}
            />
          </div>

          <div className="w-full">
            <div className="flex flex-col items-start">
              <h2 className="text-gray-300 text-md">Treino</h2>
              <div className="mb-4">
                <h3 className="text-secondary text-xl">
                  {workoutDetailData?.title}
                </h3>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="flex flex-col items-start">
              <h2 className="text-gray-300 text-md">Tipo</h2>
              <div className="mb-4">
                <h3 className="text-white text-xl">
                  {
                    optionsWorkoutType.find(
                      (option) => option.id === workoutDetailData?.type
                    )?.label
                  }
                </h3>
              </div>
            </div>
          </div>

          <div className="w-full mb-[-2px] justify-center">
            <h2 className="text-gray-300 text-md">Sets</h2>
          </div>
          <div className="w-full mb-4">
            <h3 className="text-white text-xl">
              {workoutDetailData?.sets || "-"}
            </h3>
          </div>

          <div className="w-full mb-[-2px] justify-center">
            <h2 className="text-gray-300 text-md">Repetição/Isometria/Tempo</h2>
          </div>
          <div className="w-full mb-4">
            <h3 className="text-white text-xl">
              {workoutDetailData?.repetition || "-"}
            </h3>
          </div>

          <div className="w-full mb-[-2px] justify-center">
            <h2 className="text-gray-300 text-md">Candência</h2>
          </div>
          <div className="w-full mb-4">
            <h3 className="text-white text-xl">
              {workoutDetailData?.rhythm || "-"}
            </h3>
          </div>

          <div className="w-full mb-[-2px] justify-center">
            <h2 className="text-gray-300 text-md">Tempo de descanso</h2>
          </div>
          <div className="w-full mb-4">
            <h3 className="text-white text-xl">
              {workoutDetailData?.rest || "-"}
            </h3>
          </div>

          <div className="w-full mb-[-2px] justify-center">
            <h2 className="text-gray-300 text-md">Url do video</h2>
          </div>
          <div className="w-full mb-4">
            <h3 className="text-white text-xl">
              {workoutDetailData?.url || "-"}
            </h3>
          </div>

          <div className="w-full mb-[-2px] justify-center">
            <h2 className="text-gray-300 text-md">Observação</h2>
          </div>
          <div className="w-full mb-4">
            <h3 className="text-white text-xl">
              {workoutDetailData?.observation || "-"}
            </h3>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkoutDetail;
