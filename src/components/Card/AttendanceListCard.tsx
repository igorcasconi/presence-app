import { format } from "date-fns";
import Card, { CardProps } from "./Card";
import { AttendanceProps } from "@/shared/types/attendance";

const AttendanceListCard = ({ data, onClick }: CardProps<AttendanceProps>) => {
  return (
    <Card onClick={onClick}>
      <>
        {data?.isSingleLesson && (
          <div className="flex justify-between mb-4">
            <p className="text-secondary text-md font-semibold">
              {data?.title}
            </p>
            <p className="text-white text-md">
              {format(data.date, "dd/MM/yyyy")}
            </p>
          </div>
        )}
        <div className="flex justify-between">
          <div>
            <p className="text-white text-md font-semibold">
              {data?.modalityName}
            </p>
            <p className="text-white text-md mt-1">{data?.teacherName}</p>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-white text-md">{data?.time}</p>
            {!data?.isActive && (
              <div className="w-full mt-1 bg-red-500 py-1 px-2 rounded-lg">
                <p className="text-xs text-white">Aula cancelada!</p>
              </div>
            )}
          </div>
        </div>
      </>
    </Card>
  );
};

export default AttendanceListCard;
