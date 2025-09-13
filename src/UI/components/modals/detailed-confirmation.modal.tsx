import React from "react";
import { Warning } from "@mui/icons-material";
import { ConfirmationModal } from "./confirmation.modal";

export interface DetailItem {
  label: string;
  value: string;
}

export interface DetailedConfirmationModalProps {
  modalName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  details?: DetailItem[];
  warningMessage: string;
  confirmButtonText: string;
  confirmButtonIcon?: React.ReactNode;
  isLoading?: boolean;
}

export const DetailedConfirmationModal: React.FC<DetailedConfirmationModalProps> = ({
  modalName,
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  details,
  warningMessage,
  confirmButtonText,
  confirmButtonIcon = <Warning className="w-4 h-4" />,
  isLoading = false,
}) => {
  return (
    <ConfirmationModal
      modalName={modalName}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-full">
            <Warning className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-2">{message}</p>
          
          {details && details.length > 0 && (
            <div className="text-sm text-gray-500 mb-3">
              <p>Détails :</p>
              <ul className="list-disc list-inside ml-2">
                {details.map((detail, index) => (
                  <li key={index}>
                    {detail.label}: {detail.value}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            ⚠️ {warningMessage}
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              confirmButtonIcon
            )}
            {confirmButtonText}
          </button>
        </div>
      </div>
    </ConfirmationModal>
  );
};
