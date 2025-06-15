"use client";

import Card, { CardProps } from "./Card";
import { LessonProps } from "@/shared/types/lesson";

const LessonCard = ({ data, onClick }: CardProps<LessonProps>) => {
  return (
    <Card onClick={onClick}>
      <>
        {data?.title && (
          <div className="flex justify-between mb-4">
            <p className="text-secondary text-md font-semibold">
              {data?.title}
            </p>
          </div>
        )}
        <div className="flex justify-between">
          <div>
            <p className="text-white text-md font-semibold">{data?.modality}</p>
            <p className="text-white text-md mt-1">{data?.teacher}</p>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-white text-md">{data?.time}</p>
            <p className="text-white text-md">
              {data?.translateWeekDays
                ?.map((week) => week.substring(0, 3))
                .join(", ")}
            </p>
          </div>
        </div>
        {!data?.date && (
          <div
            className={`w-full mt-1 py-1 px-2 rounded-lg ${
              data?.hasGenerateLesson ? "bg-green-600" : "bg-red-500"
            }`}
          >
            <p className="text-xs text-white">
              Aulas {data?.hasGenerateLesson ? "já" : "ainda não foram"} geradas
              para essa semana!
            </p>
          </div>
        )}
      </>
    </Card>
  );
};

export default LessonCard;
