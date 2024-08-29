"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Button, Loader } from "@/components";
import { getLessonData } from "@/firebase/database/lesson";

import { LessonProps } from "@/shared/types/lesson";
import { getModalityData } from "@/firebase/database/modality";
import { getUserData } from "@/firebase/database/user";
import { WEEK_DAYS_PT } from "@/helpers/date";

const LessonDetail = () => {
  const [lessonDetailData, setLessonDetailData] = useState<
    LessonProps | null | undefined
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams<{ uid: string }>();

  const loadUserData = async () => {
    try {
      const lessonData = await getLessonData(params.uid);
      let modalityData;
      let userDetailData;

      if (lessonData?.modality && lessonData.teacher) {
        modalityData = await getModalityData(lessonData?.modality);
        userDetailData = await getUserData(lessonData?.teacher);
      }

      const translateWeekDays = lessonData?.weekDays?.map((week) => {
        //@ts-ignore
        return WEEK_DAYS_PT[week];
      });

      const lessonObject = {
        ...lessonData,
        teacher: userDetailData?.name,
        modality: modalityData?.name,
        weekDays: translateWeekDays,
      } as LessonProps;

      setLessonDetailData(lessonObject);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="w-full h-full p-4 md:max-w-[500px] m-auto flex flex-col items-center">
      {isLoading ? (
        <div className="justify-center mt-[50%]">
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex w-full justify-end">
            <Button
              text="Excluir"
              className="h-8 max-w-24 bg-red-600 ml-2"
              textStyle="text-xs"
              disabled
            />
          </div>
          <div className="w-full">
            <div className="flex flex-col items-start">
              <h2 className="text-gray-300 text-md">Aula</h2>
              <div className="mb-4">
                <h3 className="text-white text-xl">
                  {lessonDetailData?.modality}
                </h3>
              </div>
            </div>
          </div>

          <div className="w-full mb-[-2px] justify-center">
            <h2 className="text-gray-300 text-md">Professor</h2>
          </div>
          <div className="w-full mb-4">
            <h3 className="text-white text-xl">{lessonDetailData?.teacher}</h3>
          </div>

          <div className="w-full mb-[-2px] justify-center">
            <h2 className="text-gray-300 text-md">Horário</h2>
          </div>
          <div className="w-full mb-4">
            <h3 className="text-white text-xl">{lessonDetailData?.time}</h3>
          </div>

          <div className="w-full mb-[-2px] justify-center">
            <h2 className="text-gray-300 text-md">Dias da semana</h2>
          </div>
          <div className="w-full mb-4">
            <h3 className="text-white text-xl">
              {lessonDetailData?.weekDays?.join(", ")}
            </h3>
          </div>
        </>
      )}
    </div>
  );
};

export default LessonDetail;
