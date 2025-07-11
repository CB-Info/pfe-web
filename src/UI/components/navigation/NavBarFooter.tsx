import React, { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import {
  useUsersListerDispatchContext,
  useUsersListerStateContext,
} from "../../../reducers/auth.reducer";
import { useAlerts } from "../../../hooks/useAlerts";
import FirebaseAuthManager from "../../../network/authentication/firebase.auth.manager";

interface NavBarFooterProps {
  collapsed: boolean;
}

export const NavBarFooter: React.FC<NavBarFooterProps> = ({ collapsed }) => {
  const dispatch = useUsersListerDispatchContext();
  const state = useUsersListerStateContext();
  const { addAlert, clearAlerts } = useAlerts();

  const onLogout = async () => {
    try {
      await FirebaseAuthManager.getInstance().logout();
      dispatch({ type: "UPDATE_USER", payload: undefined });
      clearAlerts();
    } catch {
      addAlert({ severity: "error", message: "Erreur lors de la déconnexion" });
    }
  };

  const getInitials = (f?: string, l?: string) =>
    f && l ? `${f[0]}${l[0]}`.toUpperCase() : "";

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
            <Popover.Panel className="absolute bottom-full left-0 z-20 mb-1 w-full overflow-hidden rounded-lg border border-gray-400 bg-white p-1.5 shadow-lg outline-none">
              <nav>
                <Link to="/settings">
                  <div className="flex text-sm items-center p-2 hover:bg-black hover:bg-opacity-10 rounded transition-all duration-300 ease-in-out justify-start">
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
                <button
                  onClick={onLogout}
                  className="flex text-sm items-center p-2 hover:bg-black hover:bg-opacity-10 rounded transition-all duration-300 ease-in-out justify-start w-full text-left"
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
                </button>
              </nav>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};
