import { ReactNode } from "react"
import { PositionModal } from "./modal.types"

interface ModalProps {
    position?: PositionModal
    fullWidth?: boolean
    width?: string
    onClose: () => void
    children: ReactNode
}

export const Modal: React.FC<ModalProps> = ({ position = PositionModal.BOTTOM, onClose, children, fullWidth = false, width = "w-72" }) => {
    return (
        <div className="z-[9999]">
            <div className='fixed left-0 top-0 h-screen w-screen' onClick={onClose}></div>
            <div className={`flex flex-col rounded-lg p-2 bg-white absolute ${position == PositionModal.TOP ? 'bottom-full mb-2' : 'top-full mt-2'} left-0 ${ fullWidth ? 'right-0' : width  } border border-solid border-blue-sky gap-1 drop-shadow-md z-[10000]`}>
                {children}
            </div>
        </div>
    )
}