import { ReactNode, useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';

interface ConfirmationModalProps {
    modalName: string;
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    modalName,
    isOpen,
    onClose,
    children,
}) => {
    useEffect(() => {
        if (isOpen) {
            const modalElement = document.getElementById(modalName) as HTMLDialogElement;
            modalElement?.showModal();
        }
    }, [isOpen, modalName]);

    return (
        <dialog id={modalName} className="modal">
            <div className="modal-box p-0 max-w-md">
                <button
                    onClick={onClose}
                    className="absolute right-2 top-2 btn btn-ghost btn-sm btn-circle"
                >
                    <CloseIcon fontSize="small" />
                </button>
                <div className="p-0">
                    {children}
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
};