import React, { ChangeEvent, useState } from 'react';
import { SearchInput } from "../UI/components/input/searchInput"
import DrawerButton from '../UI/components/drawer';
import AddDishPage from './add.dish.page';

export default function HomePage() {
  const [dishName, setDishName] = useState(''); // Gérer l'état de la valeur du champ Nom du plat
  const [searchValue, setsearchValue] = useState(''); // Gérer l'état de la valeur du champ Nom du plat

    const handleSearchValueChange = (e: ChangeEvent<HTMLInputElement>) => {
      setsearchValue(e.target.value);
  };
      
    return (
        <div className="h-screen w-full bg-bg-color">
            <span>Home</span>
            <SearchInput label="Rechercher un plat" error={false} name="Recherche" value={searchValue} onChange={handleSearchValueChange}/>
            {/* Afficher la valeur saisie */}
            <div>Valeur saisie : {dishName}</div>
            <div>Valeur de Recherche : {searchValue}</div>
            <DrawerButton width={360} label='Ajouter un repas'>
              <AddDishPage/>
            </DrawerButton>
        </div>
    )
}