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
        const modalElement = document.getElementById(modalName) as HTMLDialogElement;
        if (isOpen) {
            modalElement?.showModal();
        } else {
            modalElement?.close();
        }
        
        // Gestionnaire d'événement pour la fermeture via Escape
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, modalName, onClose]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        const modalElement = document.getElementById(modalName);
        if (e.target === modalElement) {
            onClose();
        }
    };

    return (
        <dialog 
            id={modalName} 
            className="modal" 
            onClick={handleBackdropClick}
        >
            <div className="modal-box p-0 max-w-md" onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute right-2 top-2 btn btn-ghost btn-sm btn-circle hover:bg-gray-100 transition-colors duration-200"
                >
                    <CloseIcon fontSize="small" />
                </button>
                <div className="p-0">
                    {children}
                </div>
            </div>
        </dialog>
    );
};