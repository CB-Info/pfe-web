import DrawerButton, { ContainerDrawer } from '../UI/components/drawer';
import TitleStyle from '../UI/style/title.style';
import AddDishPage from './add.dish.page';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { SearchInput } from '../UI/components/input/searchInput';
import TextfieldList from '../UI/components/textfields/textfield.list';
import { DishesRepositoryImpl } from '../network/repositories/dishes.repository';
import { useAlerts } from '../UI/components/alert/alerts-context';
import { Dish } from '../models/dish.model';
import CustomizedTables from './demo';
import { useUsersListerDispatchContext } from '../auth/auth.reducer';
import { UserRepositoryImpl } from '../network/repositories/user.respository';
import UpdateDishPage from './update.dish.page';
import CustomButton, { TypeButton, WidthButton } from '../UI/components/custom.button';
import { BaseContent } from '../UI/components/base.content';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [dishes, setDishes] = useState<Dish[]>([])
  const [selectedDish, setSelectedDish] = useState<Dish | undefined>(undefined)
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState<boolean>(false);
  const { addAlert, clearAlerts } = useAlerts();
  const dispatch = useUsersListerDispatchContext()
  const userRepository = new UserRepositoryImpl()
  const dishRepository = new DishesRepositoryImpl()

  const fetchDishes = async () => {
    try {
      setDishes(await dishRepository.getAll())
    } catch (error) {
      addAlert({ severity: 'error', message: "Erreur lors de la récupération des repas" })
    }
  }

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)
      await fetchDishes()
      await fetchUser()
      setIsLoading(false)
    }

    const fetchUser = async () => {
      try {
        const user = await userRepository.getMe()
        dispatch({ type: "UPDATE_USER", payload: user })
      } catch (error) {
        addAlert({ severity: 'error', message: "Erreur lors de la récupération de l'utilisateur" })
      }
    }

    fetch()
  }, [])

  const handleRowClick = (dish: Dish): void => {
    setSelectedDish(dish);
    setIsUpdateDrawerOpen(true);
  };

  return (
    <BaseContent>
      <div className='flex justify-between px-6 pt-8 items-center'>
        <TitleStyle>Home</TitleStyle>
        <div>
          <DrawerButton width={360} defaultChildren={<CustomButton
            type={TypeButton.PRIMARY}
            onClick={() => { }}
            width={WidthButton.SMALL}
            isLoading={false}
          >
            Ajouter un repas
          </CustomButton>} drawerId={'add-drawer-dish'}>
            <AddDishPage />
          </DrawerButton>
        </div>
      </div>
      {isLoading ?
        <div className="flex flex-1 items-center justify-center">
          <CircularProgress />
        </div>
        : <div className='flex flex-col px-6 py-4 gap-10'>
          <div className='flex gap-4'>
            <div className='w-72'>
              <SearchInput label={'Rechercher un plat'} error={false} name={''} value={''} onChange={() => { }} />
            </div>
            <div className='w-64'>
              <TextfieldList valuesToDisplay={[]} onClicked={() => { }} label={'Filtre'} />
            </div>
            <div className='w-64'>
              <TextfieldList valuesToDisplay={[]} onClicked={() => { }} label={'Filtre'} />
            </div>
          </div>
          <div>
            <CustomizedTables dishes={dishes} setSelectedDish={handleRowClick} />
          </div>
          {isUpdateDrawerOpen && selectedDish && (
            <UpdateDishDrawer dish={selectedDish} onClose={() => setIsUpdateDrawerOpen(false)} onCloseConfirm={async () => {
              setIsUpdateDrawerOpen(false)
              setIsLoading(true)
              await fetchDishes()
              setIsLoading(false)
            }} />
          )}
        </div>
      }
    </BaseContent>
  )
}

interface UpdateDishDrawerProps {
  dish: Dish;
  onClose: () => void
  onCloseConfirm: () => void;
}

const UpdateDishDrawer: React.FC<UpdateDishDrawerProps> = ({ dish, onCloseConfirm, onClose }) => {
  return (
    <div className="drawer drawer-end">
      <input id="update-dish-drawer" type="checkbox" className="drawer-toggle" checked={true} onChange={() => { }} />
      <div className="drawer-side z-50">
        <label htmlFor="update-dish-drawer" className="drawer-overlay" onClick={onClose}></label>
        <ContainerDrawer width={360}>
          <UpdateDishPage dish={dish} onClickOnConfirm={onCloseConfirm} />
        </ContainerDrawer>
      </div>
    </div>
  );
};