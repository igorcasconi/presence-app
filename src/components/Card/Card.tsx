import { AttendanceProps } from "@/shared/types/attendance";
import { format } from "date-fns";

interface CardProps {
  data?: AttendanceProps;
  onClick?: () => void;
}

const Card = ({ data, onClick }: CardProps) => {
  return (
    <div
      className="h-auto w-full flex flex-col py-2 px-4 mt-4 bg-zinc-800 rounded-md shadow-lg cursor-pointer"
      onClick={onClick}
    >
      {data?.isSingleLesson && (
        <div className="flex justify-between mb-4">
          <p className="text-secondary text-md font-semibold">{data?.title}</p>
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
        <p className="text-white text-md">Horário às {data?.time}</p>
      </div>
    </div>
  );
};

export default Card;
