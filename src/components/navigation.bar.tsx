import { ReactElement } from "react";
import HomeIcon from '@mui/icons-material/Home';
import { Link } from "react-router-dom";

export function NavigationBar() {
    return (
        <div className="w-1/5 h-screen bg-neutral-100 flex flex-col">
            <div className="w-full h-4/5 flex flex-col px-4">
                <div className="flex flex-col w-full">
                    <Link to="/home">
                        <Cell icon={<HomeIcon/>} label={'Aperçu'}></Cell>
                    </Link>
                </div>
            </div>
            <BottomContainer/>
        </div>
    )
  }
  
function BottomContainer() {
    return (
        <div className="w-full h-1/5 flex flex-col bg-black">
  
        </div>
    )
}
  
interface CellProps {
    icon?: ReactElement;
    label: string;
    className?: string;
}
  
const Cell: React.FC<CellProps> = ({ icon, label, className = '' }) => {
    return (
        <div className={`flex py-4 px-2 hover:bg-primary-orange hover:bg-opacity-15 hover:rounded-lg cursor-pointer hover:text-primary-orange ${className}`}>
            <div className='flex flex-row gap-2 items-center'>
                {icon}
                <span className='font-lufga font-semibold'>{label}</span>
            </div>
        </div>
    );
}