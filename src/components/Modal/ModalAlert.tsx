"use client";

import { Button } from "../Button";
import { CloseIcon } from "../icons";
import Modal, { ModalProps } from "./Modal";

interface ModalAlertProps extends ModalProps {
  message: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  onConfirmButton?: () => void;
  onCancelButton?: () => void;
}

const ModalAlert = ({
  onCloseModal,
  title,
  message,
  confirmButtonLabel,
  cancelButtonLabel,
  onConfirmButton,
  onCancelButton,
}: ModalAlertProps) => {
  return (
    <Modal title={title} onCloseModal={onCloseModal}>
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
    </Modal>
  );
};

export default ModalAlert;
