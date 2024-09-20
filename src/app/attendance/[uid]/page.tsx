"use client";
import { Accordion, Button, CheckIcon, Loader, Modal } from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAttendanceData,
  setUserPresence,
} from "@/firebase/database/attendance";
import { getModalityData } from "@/firebase/database/modality";
import { getUserData } from "@/firebase/database/user";
import { AttendanceProps } from "@/shared/types/attendance";
import { format, isPast } from "date-fns";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AttendanceDetails = () => {
  const [attendanceDetailData, setAttendanceDetailData] = useState<
    AttendanceProps | null | undefined
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPastAttendance, setIsPastAttendance] = useState(false);
  const params = useParams<{ uid: string }>();
  const { userData } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [userAlreadyPresent, setUserAlreadyPresent] = useState(false);
  const [attendanceListData, setAttendanceListData] = useState<
    { uid: string; name: string }[]
  >([]);

  const loadUserData = async () => {
    setAttendanceListData([]);
    try {
      const attendanceData = await getAttendanceData(params.uid);
      let modalityData;
      let userDetailData;

      if (attendanceData?.modality && attendanceData.teacher) {
        modalityData = await getModalityData(attendanceData?.modality);
        userDetailData = await getUserData(attendanceData?.teacher);
      }

      attendanceData?.attendanceList?.forEach(async (user) => {
        const userItem = await getUserData(user!);
        setAttendanceListData((listData) => [
          ...listData,
          { uid: user, name: userItem?.name! },
        ]);
      });

      const userPresence = attendanceData?.attendanceList?.includes(
        userData?.uid!
      );

      const attendanceObject = {
        ...attendanceData,
        teacherName: userDetailData?.name,
        modalityName: modalityData?.name,
      } as AttendanceProps;

      setUserAlreadyPresent(Boolean(userPresence));
      setAttendanceDetailData(attendanceObject);
      setIsPastAttendance(isPast(attendanceData?.date!));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetUserPresence = async () => {
    if (isPastAttendance) {
      return toast.info(
        "A data dessa aula já ocorreu, não é possível mais confirmar presença!"
      );
    }

    let list = attendanceDetailData?.attendanceList ?? ([] as string[]);
    try {
      if (userAlreadyPresent) {
        list = list?.filter((uid) => uid !== userData?.uid);
      } else {
        list = [...list, userData?.uid!];
      }

      const attendanceObject = {
        ...attendanceDetailData,
        attendanceList: list,
      } as AttendanceProps;

      await setUserPresence(params.uid, attendanceObject);
      toast.success(
        userAlreadyPresent
          ? "Presença cancelada com sucesso!"
          : "Presença confirmada com sucesso!"
      );
      await loadUserData();
    } catch (error) {
      console.log(error);
      toast.error("Ocorreu um erro ao confirmar/cancelar presença!");
    }
  };

  const handleCancelAttendance = async () => {
    // try {
    //   await deleteLesson(params.uid);
    //   await deleteAttendanceWithLessonId(params.uid);
    //   toast.success("Aula excluída com sucesso!");
    //   router.push("/admin/lessons");
    // } catch (error) {
    //   toast.error("Ocorreu um erro ao deletar aula!");
    // }
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
          {isModalVisible && (
            <Modal
              title="Cancelar aula?"
              message="Realmente deseja cancelar esta aula?"
              confirmButtonLabel="Confirmar"
              cancelButtonLabel="Cancelar"
              // onConfirmButton={handleDeleteLesson}
              onCancelButton={() => setModalVisible(false)}
              onCloseModal={() => setModalVisible(false)}
            />
          )}

          {attendanceDetailData?.title && (
            <div className="w-full flex flex-col items-start">
              <div className="mb-4">
                <h3 className="text-secondary text-xl font-semibold">
                  {attendanceDetailData?.title}
                </h3>
              </div>
            </div>
          )}

          <div className="w-full">
            <div className="flex flex-col items-start">
              <h2 className="text-gray-300 text-md">Aula</h2>
              <div className="mb-4">
                <h3 className="text-white text-xl">
                  {attendanceDetailData?.modalityName}
                </h3>
              </div>
            </div>
          </div>

          <div className="w-full mb-[-2px] justify-center">
            <h2 className="text-gray-300 text-md">Professor</h2>
          </div>
          <div className="w-full mb-4">
            <h3 className="text-white text-xl">
              {attendanceDetailData?.teacherName}
            </h3>
          </div>

          <div className="flex mb-[-2px] w-full justify-start">
            <div className="mr-6">
              <h2 className="text-gray-300 text-md">Data</h2>
              <div className="w-full mb-4">
                <h3 className="text-white text-xl">
                  {format(attendanceDetailData?.date!, "dd/MM/yyyy")}
                </h3>
              </div>
            </div>
            <div className="">
              <h2 className="text-gray-300 text-md">Horário</h2>
              <div className="w-full ">
                <h3 className="text-white text-xl">
                  {attendanceDetailData?.time}
                </h3>
              </div>
            </div>
          </div>

          <div className="flex w-full">
            {(userData?.isTeacher || userData?.isAdmin) && (
              <Button
                text="Cancelar aula"
                className="!bg-red-500 h-8 max-w-[140px] mr-2"
                textStyle="text-xs"
                onClick={() => setModalVisible(true)}
                disabled={isPastAttendance}
              />
            )}

            <Button
              text={
                userAlreadyPresent ? "Cancelar presença" : "Confirmar presença"
              }
              className={`${
                userAlreadyPresent ? "!bg-red-500" : "!bg-green-600"
              } h-8 max-w-[200px]`}
              textStyle="text-xs"
              onClick={handleSetUserPresence}
            />
          </div>

          <div className="w-full">
            <Accordion
              title="Lista de presença"
              startOpen={true}
              emptyText="Não há presença para essa aula!"
            >
              {attendanceListData?.map((user, index) => (
                <div key={`${user}-${index}`} className="flex items-center">
                  <CheckIcon />
                  <p className="text-white text-md ml-2">{user.name}</p>
                </div>
              ))}
            </Accordion>
          </div>
        </>
      )}
    </div>
  );
};

export default AttendanceDetails;
