"use client";
import {
  Accordion,
  Button,
  CheckIcon,
  Loader,
  Modal,
  InfoIcon,
  WarningIcon,
  InfoCard,
} from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import {
  changeStatusAttendanceList,
  getAttendanceData,
  setUserPresence,
} from "@/firebase/database/attendance";
import { getModalityData } from "@/firebase/database/modality";
import { getUserData } from "@/firebase/database/user";
import { AttendanceProps, AttendanceUserList } from "@/shared/types/attendance";
import { differenceInHours, format, isPast, set } from "date-fns";
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
    AttendanceUserList[]
  >([]);

  const loadUserData = async () => {
    if (!userData) return;

    try {
      const attendanceData = await getAttendanceData(params.uid);
      let modalityData;
      let userDetailData;

      if (attendanceData?.modality && attendanceData.teacher) {
        modalityData = await getModalityData(attendanceData?.modality);
        userDetailData = await getUserData(attendanceData?.teacher);
      }

      const listUser = await Promise.all(
        (attendanceData?.attendanceList || [])?.map(async (user) => {
          const userItem = await getUserData(user!);
          return { uid: user, name: userItem?.name! } as AttendanceUserList;
        })
      );

      const userPresence = (attendanceData?.attendanceList || []).includes(
        userData?.uid!
      );

      const attendanceObject = {
        ...attendanceData,
        teacherName: userDetailData?.name,
        modalityName: modalityData?.name,
      } as AttendanceProps;

      const splittedHour = attendanceData?.time.split(":");
      const lessonDate = set(new Date(attendanceData?.date!), {
        hours: Number(splittedHour![0]),
        minutes: Number(splittedHour![1]),
      });
      const isMoreThanOneHourLeft =
        differenceInHours(lessonDate, new Date()) > 1;

      setUserAlreadyPresent(Boolean(userPresence));
      setAttendanceDetailData(attendanceObject);
      setAttendanceListData(listUser);
      setIsPastAttendance(
        isPast(attendanceData?.date!) || !isMoreThanOneHourLeft
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetUserPresence = async () => {
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

  const handleChangeStatusAttendance = async () => {
    try {
      await changeStatusAttendanceList(params.uid, {
        ...attendanceDetailData!,
        isActive: !attendanceDetailData?.isActive,
      });
      toast.success(
        `Aula ${
          !attendanceDetailData?.isActive ? "ativar" : "cancelar"
        } com sucesso!`
      );
      setModalVisible(false);
      loadUserData();
    } catch (error) {
      toast.error("Ocorreu um erro ao cancelar/ativar esta aula!");
    }
  };

  useEffect(() => {
    loadUserData();
    //eslint-disable-next-line
  }, [userData]);

  return (
    <div className="w-full h-full pt-4 px-4 md:max-w-[500px] m-auto flex flex-col items-center">
      {isLoading ? (
        <div className="justify-center mt-[50%]">
          <Loader />
        </div>
      ) : (
        <>
          {isModalVisible && (
            <Modal
              title={`${
                !attendanceDetailData?.isActive ? "Ativar" : "Cancelar"
              } aula?`}
              message={`Realmente deseja ${
                !attendanceDetailData?.isActive ? "ativar" : "cancelar"
              } esta aula?`}
              confirmButtonLabel="Confirmar"
              cancelButtonLabel="Cancelar"
              onConfirmButton={handleChangeStatusAttendance}
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
            {(userData?.isTeacher || userData?.isAdmin) &&
              !isPastAttendance && (
                <Button
                  text={`${
                    !attendanceDetailData?.isActive ? "Ativar" : "Cancelar"
                  } aula`}
                  className={`${
                    attendanceDetailData?.isActive
                      ? "!bg-red-500"
                      : "!bg-green-600"
                  } h-8 max-w-[140px] mr-2`}
                  textStyle="text-xs"
                  onClick={() => setModalVisible(true)}
                />
              )}

            {userData?.isActive &&
              userData?.isStudent &&
              !isPastAttendance &&
              attendanceDetailData?.isActive && (
                <Button
                  text={
                    userAlreadyPresent
                      ? "Cancelar presença"
                      : "Confirmar presença"
                  }
                  className={`${
                    userAlreadyPresent ? "!bg-red-500" : "!bg-green-600"
                  } h-8 max-w-[200px]`}
                  textStyle="text-xs"
                  onClick={handleSetUserPresence}
                />
              )}
          </div>

          {!attendanceDetailData?.isActive && (
            <div className="w-full mt-4 bg-red-500 p-2 rounded-lg">
              <p className="text-sm text-white">Aula cancelada!</p>
            </div>
          )}

          <div className="w-full mt-2">
            {isPastAttendance && (
              <InfoCard
                type="warning"
                text=" A data dessa aula já ocorreu ou falta apenas 1 hora para esta
                  aula começar. Não é possível mais confirmar presença!"
              />
            )}
          </div>

          <div className="w-full">
            <Accordion
              title="Lista de presença"
              startOpen={true}
              emptyText="Não há presença para essa aula!"
            >
              {attendanceListData?.map((user, index) => (
                <div key={`${user.uid}-${index}`} className="flex items-center">
                  <CheckIcon />
                  <p className="text-white text-md ml-2">{user.name}</p>
                </div>
              ))}
            </Accordion>
          </div>

          {!isPastAttendance && (
            <InfoCard
              text="Lembre-se, a confirmação da sua presença nesta aula poderá ser
                feita até com 1 hora de antecedência. Faltando menos de 1 hora e
                caso não compareça ou ainda gostaria de participar da aula,
                entre em contato com o Professor via WhatsApp"
              type="info"
            />
          )}
        </>
      )}
    </div>
  );
};

export default AttendanceDetails;
