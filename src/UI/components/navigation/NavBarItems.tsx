import React from "react";
import { NavBarCell } from "./NavBarCell";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import { Package } from "lucide-react";
import StyleRoundedIcon from "@mui/icons-material/StyleRounded";
import LocalDiningRoundedIcon from "@mui/icons-material/LocalDiningRounded";

interface NavBarItemsProps {
  collapsed: boolean;
}

const items = [
  {
    icon: <SpaceDashboardRoundedIcon />,
    label: "Dashboard",
    path: "/dashboard",
  },
  { icon: <Package className="w-6 h-6" />, label: "Stock", path: "/stock" },
  { icon: <StyleRoundedIcon />, label: "Cards", path: "/cards" },
  { icon: <LocalDiningRoundedIcon />, label: "Dishes", path: "/dishes" },
];

export const NavBarItems: React.FC<NavBarItemsProps> = ({ collapsed }) => (
  <div className="flex flex-col flex-1">
    <div className="flex h-28" />
    <div className="flex flex-col flex-1">
      {items.map(({ icon, label, path }) => (
        <NavBarCell
          key={path}
          icon={icon}
          label={label}
          path={path}
          collapsed={collapsed}
        />
      ))}
    </div>
  </div>
);
