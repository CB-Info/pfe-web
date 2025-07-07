import { ReactElement } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavBarCellProps {
    icon?: ReactElement;
    label: string;
    className?: string;
    path: string;
}
  
export const NavBarCell: React.FC<NavBarCellProps> = ({ icon, label, className = '', path }) => {
    const location = useLocation();
    const isActive = location.pathname === path;
    
    return (
        <Link to={path}>
            <div className={`flex items-center gap-3 p-3 rounded-lg text-sm transition-all duration-200 ${
                isActive 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-slate-300 hover:bg-slate-600 hover:text-white'
            } ${className}`}>
                <div className={`${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {icon}
                </div>
                <span className='font-medium font-lufga'>{label}</span>
                {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
            </div>
        </Link>
    );
}