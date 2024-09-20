"use client";

import {
  addDays,
  eachDayOfInterval,
  format,
  isSameDay,
  isSaturday,
  isToday,
  nextMonday,
  startOfWeek,
} from "date-fns";
import { Accordion } from "../Accordion";
import { AttendanceProps } from "@/shared/types/attendance";
import { useEffect, useState } from "react";
import {
  getAttendanceWeekList,
  getSingleLessons,
} from "@/firebase/database/attendance";
import { Card } from "../Card";
import { getModalityData } from "@/firebase/database/modality";
import { getUserData } from "@/firebase/database/user";
import { useRouter } from "next/navigation";
import { Loader } from "../Loader";

const isOpenAccordionWeekDay = (weekDay: Date) => {
  return isToday(weekDay);
};

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState<
    AttendanceProps[] | undefined
  >(undefined);
  const [singleLessonAttendanceData, setSingleLessonAttendancData] = useState<
    AttendanceProps[] | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const dateForStartWeek = isSaturday(new Date())
    ? nextMonday(new Date())
    : new Date();

  const initialDayWeek = startOfWeek(dateForStartWeek, { weekStartsOn: 1 });
  const endDayWeek = addDays(initialDayWeek, 6);

  const week = eachDayOfInterval({
    start: initialDayWeek,
    end: endDayWeek,
  });

  const getAttendanceByDate = (day: Date) => {
    const days = attendanceData?.filter((weekDay) =>
      isSameDay(weekDay.date, day)
    );
    return days;
  };

  const handleGetAttendanceList = async () => {
    setIsLoading(true);
    try {
      const data = await getAttendanceWeekList(initialDayWeek, endDayWeek);
      const modifiedData = await Promise.all(
        data?.map(async (attendance) => {
          const [modalityData, userDetailData] = await Promise.all([
            getModalityData(attendance?.modality),
            getUserData(attendance?.teacher),
          ]);

          return {
            ...attendance,
            modalityName: modalityData?.name,
            teacherName: userDetailData?.name,
          } as AttendanceProps;
        }) || []
      );

      setAttendanceData(modifiedData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetSingleLessons = async () => {
    try {
      const data = await getSingleLessons();
      const modifiedData = await Promise.all(
        data?.map(async (attendance) => {
          const [modalityData, userDetailData] = await Promise.all([
            getModalityData(attendance?.modality),
            getUserData(attendance?.teacher),
          ]);

          return {
            ...attendance,
            modalityName: modalityData?.name,
            teacherName: userDetailData?.name,
          } as AttendanceProps;
        }) || []
      );

      setSingleLessonAttendancData(modifiedData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenDetails = (attendanceId?: string) => {
    router.push(`/attendance/${attendanceId}`);
  };

  useEffect(() => {
    handleGetAttendanceList();
    handleGetSingleLessons();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="w-full flex flex-col">
      {isLoading ? (
        <div className="items-center m-auto mt-10">
          <Loader />
        </div>
      ) : (
        <div className="w-full">
          <Accordion title="Aulas avulsas" startOpen={true}>
            {singleLessonAttendanceData?.map((attendance, index) => (
              <Card
                key={index}
                data={attendance}
                onClick={() => handleOpenDetails(attendance?.uid)}
              />
            ))}
          </Accordion>
          <Accordion
            title={`Segunda-feira ${format(week[0], "dd/MM")}`}
            startOpen={isOpenAccordionWeekDay(week[0])}
          >
            {getAttendanceByDate(week[0])?.map((attendance, index) => (
              <Card
                key={index}
                data={attendance}
                onClick={() => handleOpenDetails(attendance?.uid)}
              />
            ))}
          </Accordion>
          <Accordion
            title={`Terça-feira ${format(week[1], "dd/MM")}`}
            startOpen={isOpenAccordionWeekDay(week[1])}
          >
            {getAttendanceByDate(week[1])?.map((attendance, index) => (
              <Card
                key={index}
                data={attendance}
                onClick={() => handleOpenDetails(attendance?.uid)}
              />
            ))}
          </Accordion>
          <Accordion
            title={`Quarta-feira ${format(week[2], "dd/MM")}`}
            startOpen={isOpenAccordionWeekDay(week[2])}
          >
            {getAttendanceByDate(week[2])?.map((attendance, index) => (
              <Card
                key={index}
                data={attendance}
                onClick={() => handleOpenDetails(attendance?.uid)}
              />
            ))}
          </Accordion>
          <Accordion
            title={`Quinta-feira ${format(week[3], "dd/MM")}`}
            startOpen={isOpenAccordionWeekDay(week[3])}
          >
            {getAttendanceByDate(week[3])?.map((attendance, index) => (
              <Card
                key={index}
                data={attendance}
                onClick={() => handleOpenDetails(attendance?.uid)}
              />
            ))}
          </Accordion>
          <Accordion
            title={`Sexta-feira ${format(week[4], "dd/MM")}`}
            startOpen={isOpenAccordionWeekDay(week[4])}
          >
            {getAttendanceByDate(week[4])?.map((attendance, index) => (
              <Card
                key={index}
                data={attendance}
                onClick={() => handleOpenDetails(attendance?.uid)}
              />
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default Attendance;
