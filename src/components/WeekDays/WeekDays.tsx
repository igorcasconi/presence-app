"use client";

import { useState } from "react";

const WEEK_DAYS = [
  { id: "Monday", label: "Segunda-feira" },
  { id: "Tuesday", label: "Terça-feira" },
  { id: "Wednesday", label: "Quarta-feira" },
  { id: "Thursday", label: "Quinta-feira" },
  { id: "Friday", label: "Sexta-feira" },
  { id: "Saturday", label: "Sábado" },
  { id: "Sunday", label: "Domingo" },
];

interface WeekDaysProps {
  onChange: (array: string[]) => void;
}

const WeekDays = ({ onChange }: WeekDaysProps) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleSelectDay = (day: string) => {
    let arrayDays;
    if (selectedDays.includes(day)) {
      arrayDays = selectedDays.filter((selectedDay) => selectedDay !== day);
    } else {
      arrayDays = [...selectedDays, day];
    }

    onChange(arrayDays);
    setSelectedDays(arrayDays);
  };

  return (
    <div className="w-full flex justify-between">
      {WEEK_DAYS.map((day) => (
        <div
          key={day.id}
          className={`px-3 py-2 w-auto h-auto rounded-[100%] ${
            selectedDays.includes(day.id) ? "bg-secondary" : "bg-gray-500"
          }`}
          onClick={() => handleSelectDay(day.id)}
        >
          <p className="text-xs">{day.label.substring(0, 1)}</p>
        </div>
      ))}
    </div>
  );
};

export default WeekDays;
