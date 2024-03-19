import { Modal, PositionModal } from "../../modal"
import ModalInput from "../../../style/modal.input.style"
import { Ingredient } from "../../../../models/ingredient.model"
import { NavigationModal, useIngredientsListerDispatchContext, useIngredientsListerStateContext } from "../ingredients.lister.reducer"
import { CellButton } from "../../cell.button"
import { CellCLStyle } from "../ingredients.lister.style"
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { toCapitalize } from '../../../../string+extension';
import { ChangeEvent, useState } from "react"
import { ConfirmationModal } from "../../confirmation.modal"
import CustomButton, { TypeButton, WidthButton } from "../../custom.button"
import ModalButton from "../../../style/modal.button"

interface IngredientModalCreation {
    currentIngredients: Ingredient[]
    setCurrentIngredients: (ingredients: Ingredient[]) => void
}

export const IngredientsModalCreation: React.FC<IngredientModalCreation> = ({ currentIngredients, setCurrentIngredients }) => {
    const state = useIngredientsListerStateContext()
    const dispatch = useIngredientsListerDispatchContext()
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)

    function handleOnCloseCreationDishModal() {
        dispatch({ type: "UPDATE_CURRENT_INGREDIENT", payload: undefined })
        dispatch({ type: "SET_NAVIGATION_MODAL", payload: undefined })
    }

    function handleOnChangeIngredientValue(e: ChangeEvent<HTMLInputElement>) {
        const inputValue = Number(e.target.value);
        dispatch({ type: "SET_USER_INGREDIENT_VALUE_INPUT", payload: e.target.value })
    
        const currentIngredient = state.currentIngredient;
        if (currentIngredient != undefined) {
            const updatedIngredients = currentIngredients.map(ingredient => {
                if (ingredient.name === currentIngredient.name) {
                    return { ...ingredient, value: inputValue };
                }

                return ingredient;
            });
    
            setCurrentIngredients(updatedIngredients);
            dispatch({ type: "UPDATE_CURRENT_INGREDIENT", payload: { ...currentIngredient, value: inputValue } })
        }
    }

    function handleDeleteLocallyIngredient() {
        const currentIngredient = state.currentIngredient;
        if (currentIngredient != undefined) {
            const index = currentIngredients.findIndex(ingredient => ingredient.name === currentIngredient.name);

            if (index !== -1) {
                const newIngredients = [...currentIngredients];
                newIngredients.splice(index, 1);
                setCurrentIngredients(newIngredients);
                dispatch({ type: "UPDATE_CURRENT_INGREDIENT", payload: undefined})
            }
            setIsConfirmationModalOpen(false)
        }
    }

    return (
        <>
        {state.currentIngredient != undefined && (
            <Modal onClose={handleOnCloseCreationDishModal} position={PositionModal.TOP}>
                <ModalInput placeholder="Nom de l'ingrédient" value={state.userIngredientNameInput} onChange={(e) => dispatch({ type: "SET_USER_INGREDIENT_NAME_INPUT", payload: e.target.value })} />
                <CellCLStyle onClick={() => { dispatch({ type: "SET_NAVIGATION_MODAL", payload: NavigationModal.UNITY })}}>
                    <div>
                        <span>Unité</span>
                    </div>
                    <div className='flex gap-1'>
                        <span>{toCapitalize(state.currentIngredient.unity.toString())}</span>
                        <KeyboardArrowRightIcon fontSize='small' />
                    </div>
                </CellCLStyle>
                <CellCLStyle isHover={false} className='cursor-default' onClick={() => { }}>
                    <div>
                        <span>Valeur</span>
                    </div>
                    <div className='flex'>
                        <ModalInput placeholder="Valeur de l'ingrédient" value={state.userIngredientValueInput} onChange={handleOnChangeIngredientValue} />
                    </div>
                </CellCLStyle>
                <div className='border border-solid border-gray-100 w-full'></div>
                {state.currentIngredient != undefined && (
                    <>
                        <CellButton onClick={() => { setIsConfirmationModalOpen(true) }} isError={true} label="Supprimer l'ingrédient" image={<DeleteIcon fontSize='small' />} />
                    </>
                )}
            </Modal>
        )}

            {isConfirmationModalOpen && (
                <ConfirmationModal modalName="confirmation_modal" isOpen={isConfirmationModalOpen} onClose={ () => { setIsConfirmationModalOpen(false) } }>
                    <div className="flex flex-col flex-1 justify-center items-center px-6 gap-2">
                        <span className="font-inter text-base text-center px-1">Souhaitez-vous supprimer cet ingrédient de votre plat ?</span>
                        <div className="flex flex-col w-full">
                            <ModalButton isErrorColors={true} onClick={handleDeleteLocallyIngredient}>Supprimmer uniquement pour ce plat</ModalButton>
                            <ModalButton onClick={() => { setIsConfirmationModalOpen(false) }}>Annuler</ModalButton>
                        </div>
                    </div>
                </ConfirmationModal>
            )}
    </>
    )
}