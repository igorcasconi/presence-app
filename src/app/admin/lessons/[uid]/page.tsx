"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button, Loader, Modal } from "@/components";
import {
  deleteLesson,
  getLessonData,
  updateButtonGenerateLesson,
} from "@/firebase/database/lesson";
import {
  createAttendanceList,
  deleteAttendanceWithLessonId,
} from "@/firebase/database/attendance";

import { LessonProps } from "@/shared/types/lesson";
import { getModalityData } from "@/firebase/database/modality";
import { getUserData } from "@/firebase/database/user";
import { WEEK_DAYS_PT } from "@/helpers/date";
import { toast } from "react-toastify";
import { isFriday } from "date-fns";

const LessonDetail = () => {
  const [lessonDetailData, setLessonDetailData] = useState<
    LessonProps | null | undefined
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingGenerate, setIsLoadingGenerate] = useState(false);
  const [isEnabledGenerateButton, setIsEnabledGenerateButton] = useState(true);
  const params = useParams<{ uid: string }>();
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);

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
        teacherName: userDetailData?.name,
        modalityName: modalityData?.name,
        translateWeekDays: translateWeekDays,
      } as LessonProps;

      setLessonDetailData(lessonObject);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateLessonDays = async () => {
    if (!lessonDetailData) return;

    setIsLoadingGenerate(true);

    const lessonObject = lessonDetailData;
    lessonObject.uid = params.uid;

    try {
      await createAttendanceList(lessonObject);
      await updateButtonGenerateLesson(params.uid, true);
      setIsEnabledGenerateButton(false);
      toast.success("Novas aulas geradas com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Ocorreu um erro ao gerar novas aulas!");
    } finally {
      setIsLoadingGenerate(false);
    }
  };

  const handleEnableGenerateButton = async () => {
    if (isFriday(new Date())) {
      await updateButtonGenerateLesson(params.uid, false);
      setIsEnabledGenerateButton(true);
    } else {
      setIsEnabledGenerateButton(lessonDetailData?.hasGenerateLessons!);
    }
  };

  const handleDeleteLesson = async () => {
    try {
      await deleteLesson(params.uid);
      await deleteAttendanceWithLessonId(params.uid);
      toast.success("Aula excluída com sucesso!");
      router.push("/admin/lessons");
    } catch (error) {
      toast.error("Ocorreu um erro ao deletar aula!");
    }
  };

  useEffect(() => {
    loadUserData();
    handleEnableGenerateButton();
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
          {isModalVisible && (
            <Modal
              title="Excluir aula?"
              message="Realmente deseja excluir esta aula? Ao confirmar as aulas e presenças dessa semana serão apagadas!"
              confirmButtonLabel="Excluir"
              cancelButtonLabel="Cancelar"
              onConfirmButton={handleDeleteLesson}
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
          </div>
          <div className="w-full">
            <div className="flex flex-col items-start">
              <h2 className="text-gray-300 text-md">Aula</h2>
              <div className="mb-4">
                <h3 className="text-white text-xl">
                  {lessonDetailData?.modalityName}
                </h3>
              </div>
            </div>
          </div>

          <div className="w-full mb-[-2px] justify-center">
            <h2 className="text-gray-300 text-md">Professor</h2>
          </div>
          <div className="w-full mb-4">
            <h3 className="text-white text-xl">
              {lessonDetailData?.teacherName}
            </h3>
          </div>

          <div className="w-full mb-[-2px] justify-center">
            <h2 className="text-gray-300 text-md">Horário</h2>
          </div>
          <div className="w-full mb-4">
            <h3 className="text-white text-xl">{lessonDetailData?.time}</h3>
          </div>

          {!!lessonDetailData?.weekDays?.length && (
            <>
              <div className="w-full mb-[-2px] justify-center">
                <h2 className="text-gray-300 text-md">Dias da semana</h2>
              </div>
              <div className="w-full mb-4">
                <h3 className="text-white text-xl">
                  {lessonDetailData?.translateWeekDays?.join(", ")}
                </h3>
              </div>
            </>
          )}

          {!!lessonDetailData?.weekDays?.length && (
            <div className="flex w-full justify-end">
              <Button
                text="Gerar as próximas aulas"
                className="h-10"
                textStyle="text-xs"
                onClick={handleGenerateLessonDays}
                loading={isLoadingGenerate}
                disabled={!isEnabledGenerateButton}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LessonDetail;
