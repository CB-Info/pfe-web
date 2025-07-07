import React, { useState, useCallback, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  SpaceDashboardRounded as DashboardIcon,
  StyleRounded as CardsIcon,
  LocalDiningRounded as DishesIcon,
  InventoryRounded as StockIcon,
  TuneRounded as SettingsIcon,
  LogoutRounded as LogoutIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useUsersListerDispatchContext, useUsersListerStateContext } from '../../../reducers/auth.reducer';
import { useAlerts } from '../../../contexts/alerts.context';
import FirebaseAuthManager from '../../../network/authentication/firebase.auth.manager';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<any>;
}

const navigationItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
  { id: 'stock', label: 'Stock', path: '/stock', icon: StockIcon },
  { id: 'cards', label: 'Cards', path: '/cards', icon: CardsIcon },
  { id: 'dishes', label: 'Dishes', path: '/dishes', icon: DishesIcon },
];

export const ResponsiveNavigationBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const dispatch = useUsersListerDispatchContext();
  const state = useUsersListerStateContext();
  const { addAlert, clearAlerts } = useAlerts();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await FirebaseAuthManager.getInstance().logout();
      dispatch({ type: "UPDATE_USER", payload: undefined });
      clearAlerts();
    } catch (error) {
      addAlert({ severity: "error", message: "Erreur lors de la déconnexion" });
    }
  }, [dispatch, addAlert, clearAlerts]);

  const getInitials = useCallback((firstname?: string, lastname?: string) => {
    if (!firstname || !lastname) return '';
    return `${firstname[0]}${lastname[0]}`.toUpperCase();
  }, []);

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex lg:flex-col lg:w-[260px] lg:h-screen lg:bg-slate-700 lg:fixed lg:left-0 lg:top-0 lg:z-40"
        role="navigation"
        aria-label="Navigation principale"
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center h-28 px-6">
            <div className="text-white text-xl font-bold">
              🍽️ Restaurant
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700">
            <ul className="space-y-2" role="list">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <NavItem item={item} />
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="p-3">
            <UserProfileSection 
              user={state.currentUser}
              onLogout={handleLogout}
              getInitials={getInitials}
            />
          </div>
        </div>
      </motion.aside>

      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <CloseIcon className="w-6 h-6 text-gray-700" />
            ) : (
              <MenuIcon className="w-6 h-6 text-gray-700" />
            )}
          </button>
          <div className="text-lg font-bold text-gray-900">
            🍽️ Restaurant
          </div>
        </div>

        {/* Mobile User Avatar */}
        <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-sm font-medium">
          {getInitials(state.currentUser?.firstname, state.currentUser?.lastname)}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />

            {/* Mobile Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden fixed top-0 left-0 h-full w-[80%] max-w-sm bg-slate-700 z-50 flex flex-col"
              role="navigation"
              aria-label="Navigation mobile"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-600">
                  <div className="text-white text-lg font-bold">
                    🍽️ Restaurant
                  </div>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 rounded-lg hover:bg-slate-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Fermer le menu"
                  >
                    <CloseIcon className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700">
                  <ul className="space-y-2" role="list">
                    {navigationItems.map((item) => (
                      <li key={item.id}>
                        <NavItem item={item} onClick={closeMobileMenu} />
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Mobile User Profile */}
                <div className="p-3 border-t border-slate-600">
                  <UserProfileSection 
                    user={state.currentUser}
                    onLogout={handleLogout}
                    getInitials={getInitials}
                    isMobile
                  />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Content Spacer for Mobile */}
      <div className="lg:hidden h-16" />
    </>
  );
};

// Navigation Item Component
interface NavItemProps {
  item: NavItem;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ item, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === item.path || 
    (item.path === '/dashboard' && location.pathname === '/');

  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive: linkActive }) => {
        const active = linkActive || isActive;
        return `
          flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
          ${active 
            ? 'bg-white bg-opacity-10 text-white shadow-sm' 
            : 'text-gray-300 hover:bg-white hover:bg-opacity-5 hover:text-white'
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-700
        `;
      }}
      aria-current={isActive ? 'page' : undefined}
    >
      <item.icon className="w-5 h-5 flex-shrink-0" />
      <span className="truncate">{item.label}</span>
    </NavLink>
  );
};

// User Profile Section Component
interface UserProfileSectionProps {
  user: any;
  onLogout: () => void;
  getInitials: (firstname?: string, lastname?: string) => string;
  isMobile?: boolean;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({ 
  user, 
  onLogout, 
  getInitials, 
  isMobile = false 
}) => {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`
              ${open ? 'bg-white bg-opacity-10' : 'bg-slate-700'}
              flex w-full items-center gap-3 rounded-lg p-3 text-sm font-medium text-white
              hover:bg-white hover:bg-opacity-5 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-700
            `}
            aria-label="Menu utilisateur"
          >
            <div className="h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center text-white font-medium flex-shrink-0">
              {getInitials(user?.firstname, user?.lastname)}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="truncate">
                {user?.firstname} {user?.lastname}
              </div>
              <div className="text-xs text-gray-300 truncate">
                {user?.email}
              </div>
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
            <Popover.Panel 
              className={`
                absolute ${isMobile ? 'bottom-full left-0 right-0 mb-2' : 'bottom-full left-0 w-full mb-1'}
                z-20 overflow-hidden rounded-lg border border-gray-400 bg-white p-1.5 shadow-lg
                focus:outline-none
              `}
            >
              <nav role="menu">
                <NavLink
                  to="/settings"
                  className="flex gap-3 text-sm items-center p-2 hover:bg-gray-100 rounded cursor-pointer transition-colors duration-200"
                  role="menuitem"
                >
                  <SettingsIcon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Paramètres</span>
                </NavLink>
                
                <div className="h-px bg-gray-300 my-1.5" role="separator" />
                
                <button
                  onClick={onLogout}
                  className="flex w-full gap-3 text-sm items-center p-2 hover:bg-gray-100 rounded cursor-pointer transition-colors duration-200"
                  role="menuitem"
                >
                  <LogoutIcon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Déconnexion</span>
                </button>
              </nav>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};