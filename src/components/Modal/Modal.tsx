"use client";

import { Button } from "../Button";
import { CloseIcon } from "../icons";

interface ModalProps {
  title: string;
  message: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  onCloseModal?: () => void;
  onConfirmButton?: () => void;
  onCancelButton?: () => void;
}

const Modal = ({
  onCloseModal,
  title,
  message,
  confirmButtonLabel,
  cancelButtonLabel,
  onConfirmButton,
  onCancelButton,
}: ModalProps) => {
  return (
    <div
      id="default-modal"
      tabIndex={-1}
      aria-hidden="false"
      className="overflow-y-auto overflow-x-hidden fixed top-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-zinc-900 bg-opacity-90"
    >
      <div className="relative p-4 w-full max-w-200 max-h-full flex h-full justify-center">
        <div className="relative bg-zinc-700 rounded-lg shadow m-auto">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="default-modal"
              onClick={onCloseModal}
            >
              <CloseIcon />
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <div className="p-4 md:p-5 space-y-4">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {message}
            </p>
          </div>

          <div className="flex items-center justify-start p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
            {confirmButtonLabel && (
              <Button
                type="button"
                text={confirmButtonLabel}
                onClick={onConfirmButton}
                className="bg-secondary w-auto mr-4"
                textStyle="text-sm"
              />
            )}

            {cancelButtonLabel && (
              <Button
                type="button"
                text={cancelButtonLabel}
                onClick={onCancelButton}
                className="bg-slate-700 w-auto"
                textStyle="text-sm"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
