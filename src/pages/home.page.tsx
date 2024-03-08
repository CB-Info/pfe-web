import React, { ChangeEvent, useState } from 'react';
import {TextInput} from "../components/input/textInput"
import { SearchInput } from "../components/input/searchInput"

export default function HomePage() {
  const [dishName, setDishName] = useState(''); // Gérer l'état de la valeur du champ Nom du plat
  const [searchValue, setsearchValue] = useState(''); // Gérer l'état de la valeur du champ Nom du plat


    // Gérer le changement dans le TextInput
    const handleDishNameChange = (newValue: string) => {
        setDishName(newValue);
    };

    const handleSearchValueChange = (e: ChangeEvent<HTMLInputElement>) => {
      setsearchValue(e.target.value);
  };
      
    return (
        <div className="h-screen w-full bg-bg-color">
            <span>Home</span>
            <TextInput label="Nom du plat" isError={false} value={dishName} onChange={handleDishNameChange} type='text' isDisabled={false}/>
            <SearchInput label="Rechercher un plat" error={false} name="Recherche" value={searchValue} onChange={handleSearchValueChange}/>
            {/* Afficher la valeur saisie */}
            <div>Valeur saisie : {dishName}</div>
            <div>Valeur de Recherche : {searchValue}</div>
        </div>
    )
}