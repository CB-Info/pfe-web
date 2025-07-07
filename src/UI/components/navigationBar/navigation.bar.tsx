import { NavBarCell } from './navigation.bar.cell';
import { Popover, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import StyleRoundedIcon from '@mui/icons-material/StyleRounded';
import LocalDiningRoundedIcon from '@mui/icons-material/LocalDiningRounded';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Fragment, useEffect, useState } from 'react';
import { useUsersListerDispatchContext, useUsersListerStateContext } from '../../../reducers/auth.reducer';
import { useAlerts } from '../../../contexts/alerts.context';
import FirebaseAuthManager from '../../../network/authentication/firebase.auth.manager';
import { UserRepositoryImpl } from '../../../network/repositories/user.respository';
import { motion, AnimatePresence } from 'framer-motion';

export function NavBar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const userRepository = new UserRepositoryImpl();
    const { addAlert } = useAlerts();
    const dispatch = useUsersListerDispatchContext();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await userRepository.getMe();
                dispatch({ type: "UPDATE_USER", payload: user });
            } catch (error) {
                addAlert({ severity: 'error', message: "Erreur lors de la récupération de l'utilisateur" });
            }
        };

        fetchUser();
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isMobileMenuOpen && !target.closest('.mobile-nav-container')) {
                setIsMobileMenuOpen(false);
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener('click', handleClickOutside);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [window.location.pathname]);

    const navigationItems = [
        { icon: <SpaceDashboardRoundedIcon />, label: 'Dashboard', path: '/dashboard' },
        { icon: <InventoryRoundedIcon />, label: 'Stock', path: '/stock' },
        { icon: <StyleRoundedIcon />, label: 'Cards', path: '/cards' },
        { icon: <LocalDiningRoundedIcon />, label: 'Dishes', path: '/dishes' },
    ];

    return (
        <>
            {/* Desktop Navbar - Fixed width */}
            <div className="hidden lg:flex w-[260px] h-full bg-slate-700 flex-col px-3 pb-2 flex-shrink-0">
                <div className='flex flex-col flex-1'>
                    <div className='flex flex-col flex-1'>
                        {/* Logo/Brand Area */}
                        <div className='flex h-28 items-center justify-center'>
                            <div className="text-white font-bold text-xl">
                                🍽️ ERP
                            </div>
                        </div>
                        
                        {/* Navigation Items */}
                        <div className='flex flex-col flex-1 space-y-1'>
                            {navigationItems.map((item) => (
                                <NavBarCell 
                                    key={item.path}
                                    icon={item.icon} 
                                    label={item.label} 
                                    path={item.path}
                                />
                            ))}
                        </div>
                    </div>
                    
                    {/* Bottom User Section */}
                    <div className='flex w-full items-center'>
                        <div className='grow'>
                            <BottomButtonNavBar />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden bg-slate-700 h-16 flex items-center justify-between px-4 flex-shrink-0">
                {/* Logo */}
                <div className="text-white font-bold text-lg">
                    🍽️ ERP
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-white hover:bg-slate-600 rounded-lg transition-colors duration-200"
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? (
                        <CloseIcon className="w-6 h-6" />
                    ) : (
                        <MenuIcon className="w-6 h-6" />
                    )}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Mobile Menu */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="mobile-nav-container lg:hidden fixed left-0 top-0 h-full w-80 bg-slate-700 z-50 flex flex-col"
                        >
                            {/* Mobile Menu Header */}
                            <div className="flex items-center justify-between p-4 border-b border-slate-600">
                                <div className="text-white font-bold text-xl">
                                    🍽️ ERP
                                </div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-white hover:bg-slate-600 rounded-lg transition-colors duration-200"
                                >
                                    <CloseIcon className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Mobile Navigation Items */}
                            <div className="flex-1 px-3 py-4">
                                <div className="space-y-2">
                                    {navigationItems.map((item, index) => (
                                        <motion.div
                                            key={item.path}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <MobileNavBarCell 
                                                icon={item.icon} 
                                                label={item.label} 
                                                path={item.path}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile Bottom User Section */}
                            <div className="p-3 border-t border-slate-600">
                                <MobileBottomButtonNavBar onClose={() => setIsMobileMenuOpen(false)} />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

// Desktop Bottom Button Component
function BottomButtonNavBar() {
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
        if (!firstname || !lastname) return '';
        return `${firstname[0]}${lastname[0]}`.toUpperCase();
    };

    return (
        <Popover className="group relative">
            {({ open }) => (
                <>
                    <Popover.Button
                        className={`${
                            open ? 'bg-white bg-opacity-10' : 'bg-slate-700'
                        } flex w-full items-center gap-3 rounded-lg p-3 text-sm focus:outline-none text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200`}
                    >
                        <div className='h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold shadow-lg'>
                            {getInitials(state.currentUser?.firstname, state.currentUser?.lastname)}
                        </div>
                        <div className="flex-1 text-left">
                            <div className="font-medium">{state.currentUser?.firstname} {state.currentUser?.lastname}</div>
                            <div className="text-xs text-slate-300">{state.currentUser?.email}</div>
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
                        <Popover.Panel className="absolute bottom-full left-0 z-20 mb-2 w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-xl">
                            <nav className="p-2">
                                <Link to="/settings">
                                    <div className='flex gap-3 text-sm items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200'>
                                        <TuneRoundedIcon className='w-5 h-5 text-gray-600'/>
                                        <span className='font-medium text-gray-700'>Paramètres</span>
                                    </div>
                                </Link>
                                <div className="h-px bg-gray-200 my-2"/>
                                <div 
                                    className='flex gap-3 text-sm items-center p-3 hover:bg-red-50 rounded-lg cursor-pointer transition-colors duration-200 text-red-600' 
                                    onClick={onLogout}
                                >
                                    <LogoutRoundedIcon className='w-5 h-5'/>
                                    <span className='font-medium'>Déconnexion</span>
                                </div>
                            </nav>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}

// Mobile Bottom Button Component
function MobileBottomButtonNavBar({ onClose }: { onClose: () => void }) {
    const dispatch = useUsersListerDispatchContext();
    const state = useUsersListerStateContext();
    const { addAlert, clearAlerts } = useAlerts();

    const onLogout = async () => {
        try {
            await FirebaseAuthManager.getInstance().logout();
            dispatch({ type: "UPDATE_USER", payload: undefined });
            clearAlerts();
            onClose();
        } catch (error) {
            addAlert({ severity: "error", message: "Erreur lors de la déconnexion" });
        }
    };

    const getInitials = (firstname?: string, lastname?: string) => {
        if (!firstname || !lastname) return '';
        return `${firstname[0]}${lastname[0]}`.toUpperCase();
    };

    return (
        <div className="space-y-3">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-slate-600 rounded-lg">
                <div className='h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold shadow-lg'>
                    {getInitials(state.currentUser?.firstname, state.currentUser?.lastname)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">
                        {state.currentUser?.firstname} {state.currentUser?.lastname}
                    </div>
                    <div className="text-sm text-slate-300 truncate">
                        {state.currentUser?.email}
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-1">
                <Link to="/settings" onClick={onClose}>
                    <div className='flex gap-3 text-sm items-center p-3 hover:bg-slate-600 rounded-lg cursor-pointer transition-colors duration-200 text-white'>
                        <TuneRoundedIcon className='w-5 h-5'/>
                        <span className='font-medium'>Paramètres</span>
                    </div>
                </Link>
                
                <div 
                    className='flex gap-3 text-sm items-center p-3 hover:bg-red-600 rounded-lg cursor-pointer transition-colors duration-200 text-red-400 hover:text-white' 
                    onClick={onLogout}
                >
                    <LogoutRoundedIcon className='w-5 h-5'/>
                    <span className='font-medium'>Déconnexion</span>
                </div>
            </div>
        </div>
    );
}

// Mobile Navigation Cell Component
interface MobileNavBarCellProps {
    icon?: React.ReactElement;
    label: string;
    path: string;
    onClick: () => void;
}

const MobileNavBarCell: React.FC<MobileNavBarCellProps> = ({ icon, label, path, onClick }) => {
    const isActive = window.location.pathname === path;
    
    return (
        <Link to={path} onClick={onClick}>
            <div className={`flex items-center gap-4 p-4 rounded-lg text-white transition-all duration-200 ${
                isActive 
                    ? 'bg-blue-600 shadow-lg' 
                    : 'hover:bg-slate-600'
            }`}>
                <div className={`${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {icon}
                </div>
                <span className={`font-medium ${isActive ? 'text-white' : 'text-slate-200'}`}>
                    {label}
                </span>
                {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
            </div>
        </Link>
    );
};