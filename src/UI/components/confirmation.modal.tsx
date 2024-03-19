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
    }, [isOpen]);

    return (
        <dialog id={modalName} className="modal">
            <div className="modal-box relative flex">
                {/* Bouton de fermeture en haut à droite à l'intérieur de la modal-box */}
                <button
                    onClick={onClose}
                    className="btn btn-ghost btn-circle absolute top-0 right-0 m-2"
                >
                    <CloseIcon />
                </button>
                <div className="flex flex-1 py-8">
                    {children}
                </div>
                <div className="modal-action">
                    {/* Autres actions si nécessaire */}
                </div>
            </div>
        </dialog>
    );
};
