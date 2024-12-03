"use client";
import { Accordion, Button, CheckIcon, Loader, InfoCard } from "@/components";
import { optionsWorkoutType } from "@/constants/workout";

import { getWorkoutData } from "@/firebase/database/workout";
import { WorkoutProps } from "@/shared/types/workout";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const WorkoutDetails = () => {
  const [workoutDetailData, setWorkoutDetailData] = useState<
    WorkoutProps | null | undefined
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams<{ uid: string }>();

  const loadWorkoutData = async () => {
    try {
      const workoutData = await getWorkoutData(params.uid);

      const workoutObject = {
        ...workoutData,
        type: optionsWorkoutType.find(
          (workoutItem) => workoutItem?.id === workoutData?.type
        )?.label,
        url: workoutData?.url
          ?.replace("shorts", "embed")
          .replace("watch", "embed"),
      } as WorkoutProps;

      setWorkoutDetailData(workoutObject);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorkoutData();
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
          <div className="w-full flex flex-col items-start">
            <div className="mb-4">
              <h3 className="text-secondary text-xl font-semibold">
                {workoutDetailData?.title}
              </h3>
            </div>
          </div>

          {workoutDetailData?.url && (
            <iframe
              src={workoutDetailData.url}
              frameBorder="0"
              height="200"
              width="100%"
              allowFullScreen
            />
          )}

          {workoutDetailData?.observation && (
            <>
              <div className="w-full mb-[-2px] justify-center mt-4">
                <h2 className="text-gray-300 text-md">Observações</h2>
              </div>
              <div className="w-full">
                <h3 className="text-white text-xl">
                  {workoutDetailData?.observation}
                </h3>
              </div>
            </>
          )}

          <div className="w-full mt-4">
            <div className="flex flex-col items-start">
              <h2 className="text-gray-300 text-md">Tipo</h2>
              <div className="mb-4">
                <h3 className="text-white text-xl">
                  {workoutDetailData?.type}
                </h3>
              </div>
            </div>
          </div>

          <div className="w-full mb-[-2px] justify-center">
            <h2 className="text-gray-300 text-md">Sets</h2>
          </div>
          <div className="w-full mb-4">
            <h3 className="text-white text-xl">{workoutDetailData?.sets}</h3>
          </div>

          <div className="w-full mb-[-2px] justify-center">
            <h2 className="text-gray-300 text-md">Repetição/Isometria/Tempo</h2>
          </div>
          <div className="w-full mb-4">
            <h3 className="text-white text-xl">
              {workoutDetailData?.repetition}
            </h3>
          </div>

          <div className="w-full">
            <h2 className="text-gray-300 text-md">Cadência</h2>
            <div className="w-full mb-4">
              <h3 className="text-white text-xl">
                {workoutDetailData?.rhythm || "-"}
              </h3>
            </div>
          </div>

          <div className="w-full">
            <h2 className="text-gray-300 text-md">Descanso</h2>
            <div className="w-full mb-4">
              <h3 className="text-white text-xl">
                {workoutDetailData?.rest || "-"}
              </h3>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkoutDetails;
