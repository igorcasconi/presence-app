"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button, LessonCard, Loader } from "@/components";
import {
  deleteOldLessons,
  getLessonList,
  updateButtonGenerateLesson,
} from "@/firebase/database/lesson";

import { LessonProps } from "@/shared/types/lesson";
import { getModalitySelectList } from "@/firebase/database/modality";
import { getTeacherSelectList } from "@/firebase/database/user";
import {
  deleteOldAttendance,
  getThereIsLessonOnThisWeek,
} from "@/firebase/database/attendance";
import { DECREASE_LIMIT_PAGE } from "@/constants";
import { WEEK_DAYS_PT } from "@/helpers/date";
import { isFriday, isWeekend } from "date-fns";

const ITEMS_PER_PAGE = 10;

const Lesson = () => {
  const [lesson, setLesson] = useState<LessonProps[]>([]);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const router = useRouter();

  const loadClassList = async () => {
    try {
      const data = await getLessonList(lastKey, ITEMS_PER_PAGE);
      const modalitiesData = await getModalitySelectList();
      const teachersData = await getTeacherSelectList();
      const today = new Date();

      if (data) {
        const keys = Object.keys(data);

        if (!!keys.length) {
          keys.forEach(async (lesson) => {
            const hasBeenLesson = await getThereIsLessonOnThisWeek(lesson!);

            if ((isFriday(today) || isWeekend(today)) && !hasBeenLesson)
              await updateButtonGenerateLesson(lesson!, false);
          });
          const lastItemKey = keys[keys.length - DECREASE_LIMIT_PAGE];

          setLesson((prevLesson) => [
            ...prevLesson,
            ...keys
              .map((lesson) => {
                const existUser = (prevLesson || [])?.findIndex(
                  (prevLesson) => lesson === prevLesson.uid
                );

                const modalityName = modalitiesData?.find(
                  (modality) => modality?.uid === data[lesson]?.modality
                )?.name;

                const teacherName = teachersData?.find(
                  (teacher) => teacher?.uid === data[lesson]?.teacher
                )?.name;

                const translateWeekDays = data[lesson]?.weekDays?.map(
                  (week) => {
                    //@ts-ignore
                    return WEEK_DAYS_PT[week];
                  }
                );

                if (existUser === -1)
                  return {
                    ...data[lesson],
                    uid: lesson,
                    modality: modalityName,
                    teacher: teacherName,
                    translateWeekDays: translateWeekDays,
                  };
                else return {} as LessonProps;
              })
              .filter((lesson) => !!lesson.uid),
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

  const handleRouteLessonDetail = (uid?: string) => {
    router.push(`lessons/${uid}`);
  };

  const handleRouteCreateLesson = () => {
    router.push(`lessons/create`);
  };

  useEffect(() => {
    const handleLoadList = async () => {
      await deleteOldLessons();
      await deleteOldAttendance();
      loadClassList();
    };

    handleLoadList();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="w-full h-full px-4 md:max-w-[500px] m-auto flex flex-col items-center">
      <div className="w-full py-4 flex flex-col justify-center items-center">
        <h2 className="text-white text-lg">Aulas</h2>
        <Button
          text="Adicionar"
          className="mt-2 h-8"
          textStyle="text-xs"
          onClick={handleRouteCreateLesson}
        />
      </div>
      {isLoading ? (
        <div className="items-center mt-10">
          <Loader />
        </div>
      ) : (
        <div className="w-full mb-[150px]">
          <ul>
            {lesson.map((item) => (
              <LessonCard
                key={item.uid}
                data={item}
                onClick={() => handleRouteLessonDetail(item.uid)}
              />
            ))}
          </ul>
          {hasMore && !isLoading && !!lesson.length && (
            <Button
              onClick={loadClassList}
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
