import { ReactElement } from "react";
import { Link } from "react-router-dom";

interface NavBarCellProps {
    icon?: ReactElement;
    label: string;
    className?: string;
    path: string;
}
  
export const NavBarCell: React.FC<NavBarCellProps> = ({ icon, label, className = '', path }) => {
    return (
        <Link to={path}>
            <div className={`flex p-2 rounded-lg text-sm text-white hover:bg-white hover:bg-opacity-10 ${className}`}>
                <div className='flex w-full gap-2 items-center'>
                    {icon}
                    <span className='font-lufga font-normal'>{label}</span>
                </div>
            </div>
        </Link>
    );
}