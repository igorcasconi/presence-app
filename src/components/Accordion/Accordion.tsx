"use client";

import { Children, PropsWithChildren, useState } from "react";
import { ArrowDownIcon } from "../icons";

interface AccordionProps extends PropsWithChildren {
  title: string;
  startOpen?: boolean;
  emptyText?: string;
}

const Accordion = ({
  title,
  children,
  startOpen = false,
  emptyText = "Não há aulas para esse dia",
}: AccordionProps) => {
  const [openAccordion, setOpenAccordion] = useState(startOpen);
  return (
    <div className="max-w-3xl mx-auto mt-4 space-y-4 md:mt-16">
      <div
        className={`transition-all duration-200 bg-zinc-900 shadow-lg rounded-md cursor-pointer ${
          startOpen && "border border-secondary"
        }`}
      >
        <button
          type="button"
          id="question1"
          className="flex items-center justify-between w-full px-4 py-5 sm:p-6"
          onClick={() => setOpenAccordion(!openAccordion)}
        >
          <span className="flex text-lg font-regular text-gray-400">
            {title}
          </span>
          <ArrowDownIcon className={openAccordion ? "rotate-180" : ""} />
        </button>
        {openAccordion && (
          <div id="answer1" className="px-4 pt-1 pb-6">
            {!!Children.toArray(children).length ? (
              children
            ) : (
              <p className="text-sm text-white text-center">{emptyText}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Accordion;
