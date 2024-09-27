import { InfoIcon, WarningIcon } from "../icons";

interface InfoCardProps {
  type: "info" | "warning";
  text: string;
}

const InfoCard = ({ type, text }: InfoCardProps) => {
  const isInfoCard = type === "info";
  return (
    <div
      className={`w-full flex flex-col items-center h-auto p-2  rounded-lg mt-4 ${
        isInfoCard ? "bg-blue-300" : "bg-yellow-300"
      }`}
    >
      {isInfoCard ? <InfoIcon /> : <WarningIcon />}
      <p className="text-sm text-black ml-2 mt-2">{text}</p>
    </div>
  );
};

export default InfoCard;
