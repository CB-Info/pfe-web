import { NavBarCell } from './navigation.bar.cell';
import { Popover, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import StyleRoundedIcon from '@mui/icons-material/StyleRounded';
import LocalDiningRoundedIcon from '@mui/icons-material/LocalDiningRounded';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { Fragment, useEffect } from 'react';
import { useUsersListerDispatchContext, useUsersListerStateContext } from '../../../reducers/auth.reducer';
import { useAlerts } from '../../../contexts/alerts.context';
import FirebaseAuthManager from '../../../network/authentication/firebase.auth.manager';
import { UserRepositoryImpl } from '../../../network/repositories/user.respository';

export function NavBar() {
    const userRepository = new UserRepositoryImpl()
    const { addAlert } = useAlerts();
    const dispatch = useUsersListerDispatchContext();
    const state = useUsersListerStateContext();

    useEffect(() => {
        const fetchUser = async () => {
            try {
              const user = await userRepository.getMe()
              dispatch({ type: "UPDATE_USER", payload: user })
            } catch (error) {
              addAlert({ severity: 'error', message: "Erreur lors de la récupération de l'utilisateur" })
            }
          }

        fetchUser()
    }, [state.currentUser])

    return (
        <div className="w-[260px] h-full bg-slate-700 flex flex-col px-3 pb-2">
            <div className='flex flex-col flex-1'>
                <div className='flex flex-col flex-1'>
                    <div className=' flex h-28'></div>
                    <div className='flex flex-col flex-1'>
                        <NavBarCell icon={<SpaceDashboardRoundedIcon/>} label={'Dashboard'} path={'/home'}/>
                        <NavBarCell icon={<InventoryRoundedIcon/>} label={'Stock'} path={'/home'}/>
                        <NavBarCell icon={<StyleRoundedIcon/>} label={'Cards'} path={'/home'}/>
                        <NavBarCell icon={<LocalDiningRoundedIcon/>} label={'Dishes'} path={'/home'}/>
                    </div>
                </div>
                <div className='flex w-full items-center'>
                    <div className='grow'>
                        <BottomButtonNavBar/>
                    </div>
                </div>
            </div>
        </div>
    )
}

function BottomButtonNavBar() {
    const dispatch = useUsersListerDispatchContext();
    const state = useUsersListerStateContext();
    const { addAlert, clearAlerts } = useAlerts();

    const onLogout = async () => {
      try {
        await FirebaseAuthManager.getInstance().logout()
        dispatch({ type: "UPDATE_USER", payload: undefined });
        clearAlerts()
      } catch (error) {
        addAlert({ severity: "error", message: "Erreur lors de la déconnexion" })
      }
    };
    
    return (
    <Popover className="group relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`${
                open ? 'bg-white bg-opacity-10' : 'bg-slate-700'
              } flex w-full items-center gap-2 rounded-lg p-2 text-sm focus:outline-none text-white hover:bg-white hover:bg-opacity-10`}
            >
                <div className='h-8 w-8 rounded-full bg-blue-700'></div>
                <span>{state.currentUser?.firstname} {state.currentUser?.lastname}</span>
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
                        <div className='flex gap-2 text-sm items-center p-2 hover:bg-black hover:bg-opacity-10 rounded cursor-pointer'>
                            <TuneRoundedIcon className='w-6 h-6'/>
                            <span className='font-lufga font-normal'>Settings</span>
                        </div>
                    </Link>
                    <div className="h-px bg-gray-300 my-1.5"/>
                    <div className='flex gap-2 text-sm items-center p-2 hover:bg-black hover:bg-opacity-10 rounded cursor-pointer' onClick={onLogout}>
                        <LogoutRoundedIcon className='w-6 h-6'/>
                        <span className='font-lufga font-normal'>Log out</span>
                    </div>
                </nav>
                </Popover.Panel>
            </Transition>
          </>
        )}
    </Popover>
    )
}