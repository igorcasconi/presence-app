"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button, WorkoutCard, Loader } from "@/components";

import { DECREASE_LIMIT_PAGE } from "@/constants";
import { getWorkoutList } from "@/firebase/database/workout";
import { WorkoutProps } from "@/shared/types/workout";
import { optionsWorkoutType } from "@/constants/workout";

const ITEMS_PER_PAGE = 10;

const Lesson = () => {
  const [workouts, setWorkout] = useState<WorkoutProps[]>([]);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const router = useRouter();

  const loadWorkoutList = async () => {
    try {
      const data = await getWorkoutList(lastKey, ITEMS_PER_PAGE);

      if (data) {
        const keys = Object.keys(data);

        if (!!keys.length) {
          const lastItemKey = keys[keys.length - DECREASE_LIMIT_PAGE];

          setWorkout((prevWorkout) => [
            ...prevWorkout,
            ...keys
              .map((workout) => {
                const existUser = (prevWorkout || [])?.findIndex(
                  (prevWorkout) => workout === prevWorkout.uid
                );

                const typeName = optionsWorkoutType?.find(
                  (type) => type?.id === data[workout]?.type
                )?.label;

                if (existUser === -1)
                  return {
                    ...data[workout],
                    uid: workout,
                    type: typeName,
                  };
                else return {} as WorkoutProps;
              })
              .filter((workout) => !!workout.uid),
          ]);

          setLastKey(lastItemKey);
          setHasMore(keys.length > ITEMS_PER_PAGE - DECREASE_LIMIT_PAGE);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingMore(false);
      setIsLoading(false);
    }
  };

  const handleRouteWorkoutDetail = (uid?: string) => {
    router.push(`workouts/${uid}`);
  };

  const handleRouteCreateWorkout = () => {
    router.push(`workouts/create`);
  };

  useEffect(() => {
    const handleLoadList = async () => {
      loadWorkoutList();
    };

    handleLoadList();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="w-full h-full px-4 md:max-w-[500px] m-auto flex flex-col items-center">
      <div className="w-full py-4 flex flex-col justify-center items-center">
        <h2 className="text-white text-lg">Treinos</h2>
        <Button
          text="Adicionar"
          className="mt-2 h-8"
          textStyle="text-xs"
          onClick={handleRouteCreateWorkout}
        />
      </div>
      {isLoading ? (
        <div className="items-center mt-10">
          <Loader />
        </div>
      ) : (
        <div className="w-full mb-8">
          <ul>
            {workouts.map((item) => (
              <WorkoutCard
                key={item.uid}
                data={item}
                onClick={() => handleRouteWorkoutDetail(item.uid)}
              />
            ))}
          </ul>
          {hasMore && !isLoading && !!workouts.length && (
            <Button
              onClick={loadWorkoutList}
              text="Carregar mais aulas..."
              className="h-8 mt-4"
              loading={isLoadingMore}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Lesson;
