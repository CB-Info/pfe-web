import { NavBarCell } from "./navigation.bar.cell";
import { Popover, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import StyleRoundedIcon from "@mui/icons-material/StyleRounded";
import LocalDiningRoundedIcon from "@mui/icons-material/LocalDiningRounded";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { Fragment, useEffect, useState } from "react";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import {
  useUsersListerDispatchContext,
  useUsersListerStateContext,
} from "../../../reducers/auth.reducer";
import { useAlerts } from "../../../contexts/alerts.context";
import FirebaseAuthManager from "../../../network/authentication/firebase.auth.manager";
import { UserRepositoryImpl } from "../../../network/repositories/user.respository";

interface NavBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NavBar({ isOpen, onClose }: NavBarProps) {
  const userRepository = new UserRepositoryImpl();
  const { addAlert } = useAlerts();
  const dispatch = useUsersListerDispatchContext();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem("navCollapsed");
    return stored === "true";
  });

  // État pour gérer l'animation fluide
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayCollapsed, setDisplayCollapsed] = useState(isCollapsed);

  useEffect(() => {
    localStorage.setItem("navCollapsed", String(isCollapsed));
  }, [isCollapsed]);

  // Gestion de l'animation avec délai
  useEffect(() => {
    if (isCollapsed !== displayCollapsed) {
      setIsAnimating(true);

      if (isCollapsed) {
        // Fermeture: attendre que la navbar se rétrécisse avant de masquer les textes
        setTimeout(() => {
          setDisplayCollapsed(true);
          setIsAnimating(false);
        }, 300); // Même durée que la transition CSS
      } else {
        // Ouverture: montrer les textes immédiatement
        setDisplayCollapsed(false);
        setTimeout(() => {
          setIsAnimating(false);
        }, 300);
      }
    }
  }, [isCollapsed, displayCollapsed]);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKey);
    }
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await userRepository.getMe();
        dispatch({ type: "UPDATE_USER", payload: user });
      } catch (error) {
        addAlert({
          severity: "error",
          message: "Erreur lors de la récupération de l'utilisateur",
        });
      }
    };

    fetchUser();
  }, []);

  return (
    <nav
      className={`fixed md:static inset-y-0 left-0 z-50 transform bg-slate-700 flex flex-col px-3 pb-2 overflow-y-auto transition-all duration-300 ease-in-out w-1/4 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 ${isCollapsed ? "md:w-20" : "md:w-1/6"}`}
      role="navigation"
    >
      <button
        aria-label="Fermer le menu"
        onClick={onClose}
        className="md:hidden absolute top-4 right-4 p-2 text-white focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div className="flex flex-col flex-1">
        <button
          onClick={toggleCollapse}
          aria-label={
            isCollapsed ? "Ouvrir la navigation" : "Réduire la navigation"
          }
          className="hidden md:flex self-end mt-4 mb-2 p-1 text-white hover:bg-white hover:bg-opacity-10 rounded"
          disabled={isAnimating}
        >
          {isCollapsed ? (
            <ChevronRightRoundedIcon />
          ) : (
            <ChevronLeftRoundedIcon />
          )}
        </button>
        <div className="flex flex-col flex-1">
          <div className="flex h-28"></div>
          <div className="flex flex-col flex-1">
            <NavBarCell
              icon={<SpaceDashboardRoundedIcon />}
              label={"Dashboard"}
              path={"/dashboard"}
              collapsed={displayCollapsed}
            />
            <NavBarCell
              icon={<InventoryRoundedIcon />}
              label={"Stock"}
              path={"/stock"}
              collapsed={displayCollapsed}
            />
            <NavBarCell
              icon={<StyleRoundedIcon />}
              label={"Cards"}
              path={"/cards"}
              collapsed={displayCollapsed}
            />
            <NavBarCell
              icon={<LocalDiningRoundedIcon />}
              label={"Dishes"}
              path={"/dishes"}
              collapsed={displayCollapsed}
            />
          </div>
        </div>
        <div className="flex w-full items-center">
          <div className="grow">
            <BottomButtonNavBar collapsed={displayCollapsed} />
          </div>
        </div>
      </div>
    </nav>
  );
}

function BottomButtonNavBar({ collapsed }: { collapsed: boolean }) {
  const dispatch = useUsersListerDispatchContext();
  const state = useUsersListerStateContext();
  const { addAlert, clearAlerts } = useAlerts();

  const onLogout = async () => {
    try {
      await FirebaseAuthManager.getInstance().logout();
      dispatch({ type: "UPDATE_USER", payload: undefined });
      clearAlerts();
    } catch (error) {
      addAlert({ severity: "error", message: "Erreur lors de la déconnexion" });
    }
  };

  const getInitials = (firstname?: string, lastname?: string) => {
    if (!firstname || !lastname) return "";
    return `${firstname[0]}${lastname[0]}`.toUpperCase();
  };

  return (
    <Popover className="group relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`${
              open ? "bg-white bg-opacity-10" : "bg-slate-700"
            } flex w-full items-center rounded-lg p-2 text-sm focus:outline-none text-white hover:bg-white hover:bg-opacity-10 transition-all duration-300 ease-in-out justify-start`}
          >
            <div
              className={`h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center text-white font-medium flex-shrink-0 transition-all duration-300 ease-in-out ${
                collapsed ? "mx-auto" : "mr-0"
              }`}
            >
              {getInitials(
                state.currentUser?.firstname,
                state.currentUser?.lastname
              )}
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                collapsed ? "w-0 opacity-0" : "w-auto opacity-100 ml-2"
              }`}
            >
              <span className="whitespace-nowrap">
                {state.currentUser?.firstname} {state.currentUser?.lastname}
              </span>
            </div>
          </Popover.Button>
          <Transition
            as={Fragment}
            show={open}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 -translate-y-1"
            enterTo="transform opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="transform opacity-100 translate-y-0"
            leaveTo="transform opacity-0 -translate-y-1"
          >
            <Popover.Panel className="popover absolute bottom-full left-0 z-20 mb-1 w-full overflow-hidden rounded-lg border border-gray-400 bg-white p-1.5 shadow-lg outline-none opacity-100 translate-y-0">
              <nav>
                <Link to="/settings">
                  <div className="flex text-sm items-center p-2 hover:bg-black hover:bg-opacity-10 rounded cursor-pointer transition-all duration-300 ease-in-out justify-start">
                    <TuneRoundedIcon
                      className={`w-6 h-6 flex-shrink-0 transition-all duration-300 ease-in-out ${
                        collapsed ? "mx-auto" : "mr-0"
                      }`}
                    />
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        collapsed ? "w-0 opacity-0" : "w-auto opacity-100 ml-2"
                      }`}
                    >
                      <span className="font-lufga font-normal whitespace-nowrap">
                        Settings
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="h-px bg-gray-300 my-1.5" />
                <div
                  className="flex text-sm items-center p-2 hover:bg-black hover:bg-opacity-10 rounded cursor-pointer transition-all duration-300 ease-in-out justify-start"
                  onClick={onLogout}
                >
                  <LogoutRoundedIcon
                    className={`w-6 h-6 flex-shrink-0 transition-all duration-300 ease-in-out ${
                      collapsed ? "mx-auto" : "mr-0"
                    }`}
                  />
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      collapsed ? "w-0 opacity-0" : "w-auto opacity-100 ml-2"
                    }`}
                  >
                    <span className="font-lufga font-normal whitespace-nowrap">
                      Log out
                    </span>
                  </div>
                </div>
              </nav>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
