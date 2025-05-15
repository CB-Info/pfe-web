import DrawerButton, { ContainerDrawer } from '../../components/drawer';
import TitleStyle from '../../style/title.style';
import AddDishPage from './add.dish.page';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { SearchInput } from '../../components/input/searchInput';
import TextfieldList from '../../components/input/textfield.list';
import { DishesRepositoryImpl } from '../../../network/repositories/dishes.repository';
import { useAlerts } from '../../../contexts/alerts.context';
import { Dish } from '../../../data/models/dish.model';
import DishesTable from '../../components/tables/dishes/dish.table';
import UpdateDishPage from './update.dish.page';
import CustomButton, { TypeButton, WidthButton } from '../../components/buttons/custom.button';
import { BaseContent } from '../../components/contents/base.content';
import { DishCategory } from '../../../data/dto/dish.dto';
import { toCapitalize } from '../../../applications/extensions/string+extension';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | undefined>(undefined);
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [selectedStatus, setSelectedStatus] = useState<string>('Tous');
  const { addAlert } = useAlerts();
  const dishRepository = new DishesRepositoryImpl();

  const fetchDishes = async () => {
    try {
      const fetchedDishes = await dishRepository.getAll();
      setDishes(fetchedDishes);
      setFilteredDishes(fetchedDishes);
    } catch (error) {
      addAlert({ severity: 'error', message: "Erreur lors de la récupération des repas" });
    }
  };

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      await fetchDishes();
      setIsLoading(false);
    };

    fetch();
  }, []);

  useEffect(() => {
    let result = [...dishes];

    // Filter by search query
    if (searchQuery) {
      result = result.filter(dish => 
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.ingredients.some(ing => ing.ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'Toutes') {
      result = result.filter(dish => dish.category === selectedCategory.toUpperCase());
    }

    // Filter by status
    if (selectedStatus !== 'Tous') {
      const isAvailable = selectedStatus === 'Actif';
      result = result.filter(dish => dish.isAvailable === isAvailable);
    }

    setFilteredDishes(result);
  }, [searchQuery, selectedCategory, selectedStatus, dishes]);

  const handleRowClick = (dish: Dish): void => {
    setSelectedDish(dish);
    setIsUpdateDrawerOpen(true);
  };

  const categories = ['Toutes', ...Object.values(DishCategory).map(cat => toCapitalize(cat))];
  const statuses = ['Tous', 'Actif', 'Inactif'];

  return (
    <BaseContent>
      <div className='flex flex-col px-6 pt-8 gap-8'>
        <div className='flex justify-between items-center'>
          <TitleStyle>Gestion des plats</TitleStyle>
          <DrawerButton 
            width={360} 
            defaultChildren={
              <CustomButton
                type={TypeButton.PRIMARY}
                onClick={() => {}}
                width={WidthButton.SMALL}
                isLoading={false}
              >
                Ajouter un plat
              </CustomButton>
            } 
            drawerId={'add-drawer-dish'}
          >
            <AddDishPage onClickOnConfirm={async () => {
              setIsLoading(true);
              await fetchDishes();
              setIsLoading(false);
            }}/>
          </DrawerButton>
        </div>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <CircularProgress />
          </div>
        ) : (
          <div className='flex flex-col gap-6'>
            <div className='flex gap-4'>
              <div className='w-96'>
                <SearchInput 
                  label='Rechercher un plat ou ingrédient'
                  error={false}
                  name='search'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className='w-64'>
                <TextfieldList 
                  valuesToDisplay={categories}
                  onClicked={setSelectedCategory}
                  label='Catégorie'
                />
              </div>
              <div className='w-64'>
                <TextfieldList 
                  valuesToDisplay={statuses}
                  onClicked={setSelectedStatus}
                  label='Status'
                />
              </div>
            </div>

            <div className='flex flex-col gap-4'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600'>
                  {filteredDishes.length} plat{filteredDishes.length !== 1 ? 's' : ''} trouvé{filteredDishes.length !== 1 ? 's' : ''}
                </span>
              </div>
              <DishesTable dishes={filteredDishes} setSelectedDish={handleRowClick} />
            </div>
          </div>
        )}
      </div>

      {isUpdateDrawerOpen && selectedDish && (
        <UpdateDishDrawer 
          dish={selectedDish} 
          onClose={() => setIsUpdateDrawerOpen(false)} 
          onCloseConfirm={async () => {
            setIsUpdateDrawerOpen(false);
            setIsLoading(true);
            await fetchDishes();
            setIsLoading(false);
          }} 
        />
      )}
    </BaseContent>
  );
}

interface UpdateDishDrawerProps {
  dish: Dish;
  onClose: () => void;
  onCloseConfirm: () => void;
}

const UpdateDishDrawer: React.FC<UpdateDishDrawerProps> = ({ dish, onCloseConfirm, onClose }) => {
  return (
    <div className="drawer drawer-end">
      <input id="update-dish-drawer" type="checkbox" className="drawer-toggle" checked={true} onChange={() => {}} />
      <div className="drawer-side z-50">
        <label htmlFor="update-dish-drawer" className="drawer-overlay" onClick={onClose}></label>
        <ContainerDrawer width={360}>
          <UpdateDishPage dish={dish} onClickOnConfirm={onCloseConfirm} />
        </ContainerDrawer>
      </div>
    </div>
  );
};