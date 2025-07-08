import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

interface NavBarCollapseButtonProps {
  collapsed: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const NavBarCollapseButton: React.FC<NavBarCollapseButtonProps> = ({
  collapsed,
  onToggle,
  disabled = false,
}) => (
  <button
    onClick={onToggle}
    aria-label={collapsed ? "Ouvrir la navigation" : "Réduire la navigation"}
    className="hidden md:flex self-end mt-4 mb-2 p-1 text-white hover:bg-white hover:bg-opacity-10 rounded"
    disabled={disabled}
  >
    {collapsed ? <ChevronRightRoundedIcon /> : <ChevronLeftRoundedIcon />}
  </button>
);
