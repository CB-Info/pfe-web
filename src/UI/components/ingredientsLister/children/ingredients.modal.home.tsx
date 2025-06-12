import { ChangeEvent, useEffect } from "react"
import { Modal, PositionModal } from "../../modals/modal"
import ModalInput from "../../../style/modal.input.style"
import { Ingredient } from "../../../../data/models/ingredient.model"
import { NavigationModal, useIngredientsListerDispatchContext, useIngredientsListerStateContext } from "../ingredients.lister.reducer"
import { CellButton } from "../../buttons/cell.button"
import { IngredientRepositoryImpl } from "../../../../network/repositories/ingredients.repository"
import { IngredientDto } from "../../../../data/dto/ingredient.dto"

interface IngredientModalHome {
    ingredientsDisplay: Ingredient[]
    currentIngredients: Ingredient[]
    setCurrentIngredients: (ingredients: Ingredient[]) => void
    setIngredientsDisplay: (ingredients: Ingredient[]) => void
}

export const IngredientsModalHome: React.FC<IngredientModalHome> = ({ ingredientsDisplay, currentIngredients, setCurrentIngredients, setIngredientsDisplay }) => {
    const state = useIngredientsListerStateContext()
    const dispatch = useIngredientsListerDispatchContext()

    const ingredientRepositoryImpl = new IngredientRepositoryImpl()

    useEffect(() => {
        if (state.suggestIngredients.length == 0) {
            dispatch({ type: 'UPDATE_SUGGEST_INGREDIENTS', payload: ingredientsDisplay })
        }
    }, [dispatch, ingredientsDisplay, state.suggestIngredients.length])

    useEffect(() => {
        if (state.searchIngredientInput != "") {
            const fetchIngredients = async () => {
                if (state.searchIngredientInput) {
                    try {
                        const response = await ingredientRepositoryImpl.getByName(state.searchIngredientInput)
                        setIngredientsDisplay(response);
                    } catch (error) {
                        console.error("Erreur lors de la récupération des ingrédients:", error);
                        setIngredientsDisplay([]);
                    }
                }
            };

            const timerId = setTimeout(() => {
                fetchIngredients();
            }, 500);

            return () => clearTimeout(timerId);
        }

    }, [state.searchIngredientInput, ingredientRepositoryImpl, setIngredientsDisplay]);



    function onChangeInput(e: ChangeEvent<HTMLInputElement>) {
        dispatch({ type: "SET_SEARCH_INPUT", payload: e.target.value })
    }

    function reset() {
        dispatch({ type: "SET_SEARCH_INPUT", payload: "" })
        dispatch({ type: "SET_USER_INGREDIENT_NAME_INPUT", payload: "" })
        dispatch({ type: "SET_USER_INGREDIENT_VALUE_INPUT", payload: "" })
    }

    async function handleOnClickOnNewIngredient() {
        try {
            const ingredientDto: IngredientDto = { _id: "", name: state.searchIngredientInput }
            const newIngredient = await ingredientRepositoryImpl.createOne(ingredientDto)
            reset()
            setCurrentIngredients([...currentIngredients, newIngredient]);
            setIngredientsDisplay([...ingredientsDisplay, newIngredient])
            dispatch({ type: "SET_USER_INGREDIENT_NAME_INPUT", payload: newIngredient.name })
            dispatch({ type: "UPDATE_CURRENT_INGREDIENT", payload: newIngredient })
            dispatch({ type: "SET_NAVIGATION_MODAL", payload: NavigationModal.CREATION_INGREDIENT })
        } catch (error) {
            console.log(error)
        }
    }

    function handleOnIngredient(ingredient: Ingredient) {
        reset()
        const existingIngredient = currentIngredients.find(e => e.name.toLowerCase() === ingredient.name.toLowerCase());
        const ingredientToUse = existingIngredient || ingredient;

        if (!existingIngredient) {
            setCurrentIngredients([...currentIngredients, ingredientToUse])
        }

        dispatch({ type: "SET_USER_INGREDIENT_NAME_INPUT", payload: ingredientToUse.name })
        dispatch({ type: "UPDATE_CURRENT_INGREDIENT", payload: ingredientToUse })
        dispatch({ type: "SET_USER_INGREDIENT_VALUE_INPUT", payload: ingredientToUse.value?.toString() ?? "" })
        dispatch({ type: "SET_NAVIGATION_MODAL", payload: NavigationModal.CREATION_INGREDIENT })
    }

    return (
        <Modal onClose={() => dispatch({ type: "SET_NAVIGATION_MODAL", payload: undefined })} position={PositionModal.TOP}>
            <>
                <ModalInput placeholder="Rechercher un  ingrédient ou ajouter un nouvel ingrédient" value={state.searchIngredientInput} onChange={onChangeInput} />
                <div className='flex flex-col py-1.5 gap-2'>

                    {(state.searchIngredientInput.length != 0) ? (
                        <div className='flex flex-col'>
                            <span className='font-inter font-semibold text-xs px-3.5 cursor-default pb-2'>Ingrédients</span>
                            {
                                ingredientsDisplay.length > 0 ? (
                                    ingredientsDisplay.map((ingredient) => <CellButton key={ingredient.name} onClick={() => handleOnIngredient(ingredient)} label={ingredient.name} />)
                                ) : (
                                    <div className='text-center text-xs'>Aucun ingrédient</div>
                                )
                            }
                        </div>
                    ) : <div className='flex flex-col'>
                        <span className='font-inter font-semibold text-xs px-3.5 cursor-default pb-2'>Suggestion d'ingrédients</span>
                        {
                            state.suggestIngredients.length > 0 ? (
                                state.suggestIngredients.map((ingredient) => <CellButton key={ingredient.name} onClick={() => handleOnIngredient(ingredient)} label={ingredient.name} />)
                            ) : (
                                <div className='text-center text-xs'>Aucun ingrédient</div>
                            )
                        }
                    </div>}
                    {state.searchIngredientInput.length != 0 && !ingredientsDisplay.find(e => e.name.toLowerCase() === state.searchIngredientInput.toLowerCase()) && (
                        <div className='flex flex-col'>
                            <span className='font-inter font-semibold text-xs px-3.5 cursor-default pb-2'>Sélectionner pour ajouter</span>
                            <CellButton onClick={handleOnClickOnNewIngredient} label={state.searchIngredientInput} />
                        </div>
                    )}
                </div>
            </>
        </Modal>
    )
}