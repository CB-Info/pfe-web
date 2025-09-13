import React, { useEffect, useState } from "react";
import { NavBarCloseButton } from "./NavBarCloseButton";
import { NavBarCollapseButton } from "./NavBarCollapseButton";
import { NavBarItems } from "./NavBarItems";
import { NavBarFooter } from "./NavBarFooter";

interface NavBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ isOpen, onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(
    () => localStorage.getItem("navCollapsed") === "true"
  );
  const [displayCollapsed, setDisplayCollapsed] = useState(isCollapsed);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sauvegarde du collapse
  useEffect(() => {
    localStorage.setItem("navCollapsed", String(isCollapsed));
  }, [isCollapsed]);

  // Animation fluide
  useEffect(() => {
    if (isCollapsed !== displayCollapsed) {
      setIsAnimating(true);
      if (isCollapsed) {
        setTimeout(() => {
          setDisplayCollapsed(true);
          setIsAnimating(false);
        }, 300);
      } else {
        setDisplayCollapsed(false);
        setTimeout(() => setIsAnimating(false), 300);
      }
    }
  }, [isCollapsed, displayCollapsed]);

  // Fermer au Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Le chargement des données utilisateur se fait maintenant dans AuthProvider

  return (
    <nav
      className={`fixed md:static inset-y-0 left-0 z-50 bg-slate-700 flex flex-col px-3 pb-2 overflow-y-auto transition-all duration-300 ease-in-out w-1/4 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 ${isCollapsed ? "md:w-20" : "md:w-1/6"}`}
      role="navigation"
    >
      <NavBarCloseButton onClose={onClose} />
      <div className="flex flex-col flex-1">
        <NavBarCollapseButton
          collapsed={isCollapsed}
          onToggle={() => setIsCollapsed((prev) => !prev)}
          disabled={isAnimating}
        />

        <NavBarItems collapsed={displayCollapsed} />

        <div className="flex w-full items-center mt-2">
          <div className="grow">
            <NavBarFooter collapsed={displayCollapsed} />
          </div>
        </div>
      </div>
    </nav>
  );
};
