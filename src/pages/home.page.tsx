import { ChangeEvent, useState } from 'react';
import { SearchInput } from "../UI/components/input/searchInput"
import DrawerButton from '../UI/components/drawer';
import AddDishPage from './add.dish.page';
import { BaseContent } from '../UI/components/base.content';

export default function HomePage() {
  const [dishName, setDishName] = useState('');
  const [searchValue, setsearchValue] = useState('');

    const handleSearchValueChange = (e: ChangeEvent<HTMLInputElement>) => {
      setsearchValue(e.target.value);
  };
      
    return (
        <BaseContent>
            <span>Home</span>
            <SearchInput label="Rechercher un plat" error={false} name="Recherche" value={searchValue} onChange={handleSearchValueChange}/>
            <div>Valeur saisie : {dishName}</div>
            <div>Valeur de Recherche : {searchValue}</div>
            <DrawerButton width={360} label='Ajouter un repas'>
              <AddDishPage/>
            </DrawerButton>
        </BaseContent>
    )
}