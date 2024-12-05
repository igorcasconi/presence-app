"use client";

import { WorkoutProps } from "@/shared/types/workout";
import Card, { CardProps } from "./Card";
import { optionsWorkoutType } from "@/constants/workout";

const WorkoutCard = ({ data, onClick }: CardProps<WorkoutProps>) => {
  return (
    <Card onClick={onClick}>
      <>
        {data?.title && (
          <div className="flex justify-between mb-1">
            <p className="text-secondary text-md font-semibold">
              {data?.title}
            </p>
          </div>
        )}
        <div className="flex justify-between">
          <div>
            <p className="text-white text-sm mt-1">
              {!!data?.position ? `${data.position} - ` : ""}{" "}
              {
                optionsWorkoutType.find(
                  (workoutItem) => workoutItem.id === data?.type
                )?.label
              }
            </p>
          </div>
        </div>
      </>
    </Card>
  );
};

export default WorkoutCard;
