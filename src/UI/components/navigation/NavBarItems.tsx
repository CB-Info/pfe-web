import React from "react";
import { NavBarCell } from "./NavBarCell";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import StyleRoundedIcon from "@mui/icons-material/StyleRounded";
import LocalDiningRoundedIcon from "@mui/icons-material/LocalDiningRounded";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ChefHatIcon from "@mui/icons-material/Restaurant";
import { useUsersListerStateContext } from "../../../reducers/auth.reducer";
import { UserRole } from "../../../data/models/user.model";

interface NavBarItemsProps {
  collapsed: boolean;
}

interface NavItem {
  icon: React.ReactElement;
  label: string;
  path: string;
  roles: UserRole[];
}

const allItems: NavItem[] = [
  {
    icon: <SpaceDashboardRoundedIcon />,
    label: "Dashboard",
    path: "/dashboard",
    roles: ["CUSTOMER", "WAITER", "KITCHEN_STAFF", "MANAGER", "OWNER", "ADMIN"],
  },
  {
    icon: <RestaurantMenuIcon />,
    label: "Commandes",
    path: "/orders",
    roles: ["WAITER", "MANAGER", "OWNER", "ADMIN"],
  },
  {
    icon: <ChefHatIcon />,
    label: "Cuisine",
    path: "/kitchen",
    roles: ["KITCHEN_STAFF", "MANAGER", "OWNER", "ADMIN"],
  },
  {
    icon: <InventoryRoundedIcon />,
    label: "Stock",
    path: "/stock",
    roles: ["KITCHEN_STAFF", "MANAGER", "OWNER", "ADMIN"],
  },
  {
    icon: <StyleRoundedIcon />,
    label: "Cards",
    path: "/cards",
    roles: ["MANAGER", "OWNER", "ADMIN"],
  },
  {
    icon: <LocalDiningRoundedIcon />,
    label: "Dishes",
    path: "/dishes",
    roles: ["KITCHEN_STAFF", "MANAGER", "OWNER", "ADMIN"],
  },
];

export const NavBarItems: React.FC<NavBarItemsProps> = ({ collapsed }) => {
  const { currentUser } = useUsersListerStateContext();

  // Filtrer les éléments de navigation en fonction du rôle de l'utilisateur
  const visibleItems = allItems.filter(
    (item) => currentUser && item.roles.includes(currentUser.role)
  );

  return (
    <div className="flex flex-col flex-1">
      <div className="flex h-28" />
      <div className="flex flex-col flex-1">
        {visibleItems.map(({ icon, label, path }) => (
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
};
