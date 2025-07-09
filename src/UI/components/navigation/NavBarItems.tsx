import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, Package, CreditCard, UtensilsCrossed } from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutGrid },
  { name: "Inventaire", path: "/dishes", icon: Package },
  { name: "Cartes", path: "/cards", icon: CreditCard },
  { name: "Repas", path: "/meals", icon: UtensilsCrossed },
];

const NavBarItems = () => {
  const location = useLocation();

  return (
    <nav className="flex-1 px-4 py-4 space-y-2">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isActive
                ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <IconComponent className="h-5 w-5 mr-3" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};

export { NavBarItems };
export default NavBarItems;
