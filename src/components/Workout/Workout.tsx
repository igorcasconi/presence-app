"use client";

import { Accordion } from "../Accordion";
import { WorkoutCard } from "../Card";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { Loader } from "../Loader";
import { WorkoutProps } from "@/shared/types/workout";
import { getWorkoutFullList } from "@/firebase/database/workout";
import { WORKOUT_TYPES } from "@/constants/workout";

const Workout = () => {
  const [workoutData, setWorkoutData] = useState<WorkoutProps[] | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const getWorkoutByTypes = (type: string) => {
    const workouts = workoutData?.filter((workout) => workout.type === type);
    return workouts;
  };

  const handleGetWorkouts = async () => {
    setIsLoading(true);
    try {
      const data = await getWorkoutFullList();

      const modifiedData =
        data?.map((workout) => ({
          ...workout,
        })) || ([] as WorkoutProps[]);

      setWorkoutData(modifiedData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenWorkout = (workoutId?: string) => {
    router.push(`/workout/${workoutId}`);
  };

  useEffect(() => {
    handleGetWorkouts();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="w-full flex flex-col">
      {isLoading ? (
        <div className="items-center m-auto mt-10">
          <Loader />
        </div>
      ) : (
        <div className="w-full mb-10">
          <Accordion
            title="Membros superiores"
            startOpen={false}
            emptyText="Não há treinos cadastrados!"
          >
            {getWorkoutByTypes(WORKOUT_TYPES.UPPER_LIMBS)
              ?.sort((a, b) => Number(a?.position) - Number(b?.position))
              ?.map((workout, index) => (
                <WorkoutCard
                  key={index}
                  data={workout}
                  onClick={() => handleOpenWorkout(workout?.uid)}
                />
              ))}
          </Accordion>
          <Accordion
            title="Membros inferiores"
            startOpen={false}
            emptyText="Não há treinos cadastrados!"
          >
            {getWorkoutByTypes(WORKOUT_TYPES.LOWER_LIMBS)?.map(
              (workout, index) => (
                <WorkoutCard
                  key={index}
                  data={workout}
                  onClick={() => handleOpenWorkout(workout?.uid)}
                />
              )
            )}
          </Accordion>
          <Accordion
            title="Força"
            startOpen={false}
            emptyText="Não há treinos cadastrados!"
          >
            {getWorkoutByTypes(WORKOUT_TYPES.FORCE)?.map((workout, index) => (
              <WorkoutCard
                key={index}
                data={workout}
                onClick={() => handleOpenWorkout(workout?.uid)}
              />
            ))}
          </Accordion>
          <Accordion
            title="Locomoção"
            startOpen={false}
            emptyText="Não há treinos cadastrados!"
          >
            {getWorkoutByTypes(WORKOUT_TYPES.LOCOMOTION)?.map(
              (workout, index) => (
                <WorkoutCard
                  key={index}
                  data={workout}
                  onClick={() => handleOpenWorkout(workout?.uid)}
                />
              )
            )}
          </Accordion>
          <Accordion
            title="Mobilidade"
            startOpen={false}
            emptyText="Não há treinos cadastrados!"
          >
            {getWorkoutByTypes(WORKOUT_TYPES.MOBILITY)?.map(
              (workout, index) => (
                <WorkoutCard
                  key={index}
                  data={workout}
                  onClick={() => handleOpenWorkout(workout?.uid)}
                />
              )
            )}
          </Accordion>
          <Accordion
            title="Parada de mão"
            startOpen={false}
            emptyText="Não há treinos cadastrados!"
          >
            {getWorkoutByTypes(WORKOUT_TYPES.HANDSTAND)?.map(
              (workout, index) => (
                <WorkoutCard
                  key={index}
                  data={workout}
                  onClick={() => handleOpenWorkout(workout?.uid)}
                />
              )
            )}
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default Workout;
