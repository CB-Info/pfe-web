import { useReducer } from 'react';
import Badge from '../badge';
import { Ingredient } from '../../../models/ingredient.model';
import {  DotButton } from './ingredients.lister.style';
import { IngredientsListerDispatchContext, IngredientsListerStateContext, NavigationModal, ingredientsListerInitialState, ingredientsListerlocalReducer } from './ingredients.lister.reducer';
import { IngredientsModal } from './children/ingredients.modal';
import LabelStyle from '../../style/label.style';

interface IngredientsListerProps {
    ingredients: Ingredient[]
    currentIngredients: Ingredient[]
    setIngredients: (ingredients: Ingredient[]) => void
    setCurrentIngredients: (ingredients: Ingredient[]) => void
}

export const IngredientsLister: React.FC<IngredientsListerProps> = ({ ingredients, currentIngredients, setCurrentIngredients, setIngredients }) => {
    const [state, dispatch] = useReducer(ingredientsListerlocalReducer, ingredientsListerInitialState);

    return (
        <IngredientsListerStateContext.Provider value={state}>
            <IngredientsListerDispatchContext.Provider value={dispatch}>
                <div className='flex flex-col w-full'>
                    <LabelStyle >Ingrédients</LabelStyle>
                    <div className='flex flex-wrap pb-2 gap-2'>
                        <div className='flex relative'>
                            <DotButton type='button' onClick={() => dispatch({ type: "SET_NAVIGATION_MODAL", payload: NavigationModal.HOME })}>Ajouter</DotButton>
                            <IngredientsModal ingredientsDisplay={ingredients} currentIngredients={currentIngredients} setCurrentIngredients={setCurrentIngredients} setIngredientsDisplay={setIngredients} />
                        </div>
                        {currentIngredients.map((ingredient, index) => {
                            return (
                                <Badge key={index} label={ingredient.name}></Badge>
                            )
                        })}
                    </div>
                </div>
            </IngredientsListerDispatchContext.Provider>
        </IngredientsListerStateContext.Provider>
    )
}

export default IngredientsLister