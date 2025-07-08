import { ReactElement } from "react";
import { Link } from "react-router-dom";

interface NavBarCellProps {
  icon?: ReactElement;
  label: string;
  className?: string;
  path: string;
  collapsed?: boolean;
}

export const NavBarCell: React.FC<NavBarCellProps> = ({
  icon,
  label,
  className = "",
  path,
  collapsed = false,
}) => {
  return (
    <Link to={path}>
      <div
        className={`flex p-2 rounded-lg text-sm text-white hover:bg-white hover:bg-opacity-10 transition-all duration-300 ease-in-out ${className}`}
      >
        <div className="flex w-full items-center justify-start">
          <div
            className={`flex-shrink-0 transition-all duration-300 ease-in-out ${
              collapsed ? "mx-auto" : "mr-0"
            }`}
          >
            {icon}
          </div>
          {!collapsed && (
            <div className="overflow-hidden transition-all duration-300 ease-in-out w-auto opacity-100 ml-2">
              <span className="font-lufga font-normal whitespace-nowrap">
                {label}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
