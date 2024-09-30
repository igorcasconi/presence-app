"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";

import { Button, Loader } from "@/components";
import { deleteOldLessons, getLessonList } from "@/firebase/database/lesson";

import { LessonProps } from "@/shared/types/lesson";
import { getModalitySelectList } from "@/firebase/database/modality";
import { getTeacherSelectList } from "@/firebase/database/user";
import { deleteOldAttendance } from "@/firebase/database/attendance";
import { DECREASE_LIMIT_PAGE } from "@/constants";

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

      if (data) {
        const keys = Object.keys(data);
        if (!!keys.length) {
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

                if (existUser === -1)
                  return {
                    uid: lesson,
                    ...data[lesson],
                    modality: modalityName,
                    teacher: teacherName,
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
        <div className="w-full">
          <ul>
            {lesson.map((item) => (
              <li
                key={item.uid}
                className="border-b-[1px] py-2 px-4 flex justify-between cursor-pointer"
                onClick={() => handleRouteLessonDetail(item.uid)}
              >
                <p className="text-white text-md">{item.modality}</p>
                <p className="text-white text-md">
                  {!!item.date
                    ? `${format(item.date, "dd/MM/yyyy")} às ${item.time}`
                    : item.time}
                </p>
                <p className="text-white text-md">
                  {item.teacher?.split(" ")[0]}
                </p>
              </li>
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
