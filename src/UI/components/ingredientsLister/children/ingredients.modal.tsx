import { Modal, PositionModal } from "../../modal"
import ModalInput from "../../../style/modal.input.style"
import { toCapitalize } from '../../../../string+extension';
import { Ingredient, IngredientUnity } from "../../../../models/ingredient.model";
import { CellButton } from "../../cell.button";
import { NavigationModal, useIngredientsListerDispatchContext, useIngredientsListerStateContext } from "../ingredients.lister.reducer";
import { IngredientsModalHome } from "./ingredients.modal.home";
import { IngredientsModalCreation } from "./ingredients.modal.creation.ingredient";

interface IngredientModal {
    ingredientsDisplay: Ingredient[]
    currentIngredients: Ingredient[]
    setCurrentIngredients: (ingredients: Ingredient[]) => void
    setIngredientsDisplay: (ingredients: Ingredient[]) => void
}

export const IngredientsModal: React.FC<IngredientModal> = ({ ingredientsDisplay, currentIngredients, setCurrentIngredients, setIngredientsDisplay }) => {
    const state = useIngredientsListerStateContext()
    const dispatch = useIngredientsListerDispatchContext()

    const filteredIngredients = ingredientsDisplay.length > 0 ? ingredientsDisplay.filter(ingredient => ingredient.name.toLowerCase().includes(state.searchIngredientInput.toLowerCase())) : [];
    const isInputInIngredients = filteredIngredients.length > 0;

    function onClickOnUnity(unity: IngredientUnity) {
        const currentIngredient = state.currentIngredient;
        if (currentIngredient != undefined) {
            const updatedIngredients = currentIngredients.map(ingredient => {
                if (ingredient.name === currentIngredient.name) {
                    return { ...ingredient, unity: unity };
                }

                return ingredient;
            });
    
            setCurrentIngredients(updatedIngredients);
            dispatch({ type: "UPDATE_CURRENT_INGREDIENT", payload: { ...currentIngredient, unity: unity } })
        }
        dispatch({ type: "SET_NAVIGATION_MODAL", payload: NavigationModal.CREATION_INGREDIENT })
    }

    switch (state.navigationModal) {
        case NavigationModal.HOME:
            return (
                <IngredientsModalHome ingredientsDisplay={ingredientsDisplay} currentIngredients={currentIngredients} setCurrentIngredients={setCurrentIngredients} setIngredientsDisplay={setIngredientsDisplay}/>
            )
        case NavigationModal.CREATION_INGREDIENT:
            return (
                <IngredientsModalCreation currentIngredients={currentIngredients} setCurrentIngredients={setCurrentIngredients}/>
            )
        case NavigationModal.UNITY:
            return (
                <>
                    <Modal onClose={() => { dispatch({ type: "SET_NAVIGATION_MODAL", payload: undefined })}} position={PositionModal.TOP}>
                        <ModalInput placeholder="Rechercher une unité de mesure" value={state.userSearchUnity} onChange={(e) => dispatch({ type: 'SET_USER_SEARCH_UNITY', payload: e.target.value })} />
                        <div className='flex flex-col py-1.5 gap-2'>
                            {(isInputInIngredients || state.searchIngredientInput.length == 0) && (
                                <div className='flex flex-col'>
                                    <span className='font-inter font-semibold text-xs px-3.5 cursor-default pb-2'>Unité</span>
                                    {Object.values(IngredientUnity).map((element, index) => {
                                        return (
                                            <CellButton key={index} onClick={() => { onClickOnUnity(element) }} label={toCapitalize(element.toString())} />
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </Modal>
                </>
            )
    }
}