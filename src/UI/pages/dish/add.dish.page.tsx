import { FormEvent, useEffect, useState } from "react";
import BorderContainer from "../../style/border.container.style";
import { TextInput } from "../../components/input/textInput";
import TextfieldList from "../../components/input/textfield.list";
import CustomButton, { TypeButton, WidthButton } from "../../components/buttons/custom.button";
import TitleStyle from "../../style/title.style";
import IngredientsLister from "../../components/ingredientsLister/ingredients.lister";
import { Ingredient } from "../../../data/models/ingredient.model";
import { NumberInput } from "../../components/input/number.input";
import { CircularProgress } from "@mui/material";
import { DishesRepositoryImpl } from "../../../network/repositories/dishes.repository";
import { DishCategory } from "../../../data/dto/dish.dto";
import { toCapitalize } from "../../../applications/extensions/string+extension";
import { useAlerts } from "../../../contexts/alerts.context";
import { DishIngredientCreationDto } from "../../../data/dto/dish.creation.dto";

interface AddDishPageProps {
    onClickOnConfirm: () => void
}

const AddDishPage: React.FC<AddDishPageProps> = ({ onClickOnConfirm }) => {
    const [dishName, setDishName] = useState("")
    const [dishDescription, setDishDescription] = useState("")
    const [dishPrice, setDishPrice] = useState("")
    const [dishCategory, setDishCategory] = useState<DishCategory>(DishCategory.MEAT)
    const [ingredientsDish, setIngredientsDish] = useState<Ingredient[]>([])
    const [allIngredients, setAllIngredients] = useState<Ingredient[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingCreationDish, setIsLoadingCreationDish] = useState(false)

    const dishesRepository = new DishesRepositoryImpl()
    const [inputError, setInputError] = useState<InputError | undefined>(undefined)
    const { addAlert, clearAlerts } = useAlerts();

    enum InputError {
        NAME,
        DESCRIPTION,
        PRICE
    }

    useEffect(() => {
        const fetchAllIngredientsData = async () => {
            setIsLoading(true)
            try {
                const response = await dishesRepository.getTopIngredients()
                setAllIngredients(response)
                setIsLoading(false)
            } catch {
                addAlert({ severity: "error", message: "Une erreur est survenue lors de la récupération des données", timeout: 10 })
            }
        }

        fetchAllIngredientsData()
    }, [])

    function reset() {
        setDishName("")
        setDishDescription("")
        setDishPrice("")
        setIngredientsDish([])
        setDishCategory(DishCategory.MEAT)
        setInputError(undefined)
        clearAlerts()
    }

    function handleOnClosePage() {
        const drawerCheckbox = document.getElementById('add-drawer-dish') as HTMLInputElement;
        if (drawerCheckbox) {
            reset()
            drawerCheckbox.checked = !drawerCheckbox.checked;
        }
    }

    function handleOnClickOnCellCategory(e: string) {
        if (e.toUpperCase() in DishCategory) {
            setDishCategory(DishCategory[e as keyof typeof DishCategory])
        }
    }

    const validateForm = (): boolean => {
        if (!dishName) {
            setInputError(InputError.NAME)
            addAlert({ severity: "error", message: "Le nom est obligatoire", timeout: 5 })
            return false
        }

        if (!dishDescription) {
            setInputError(InputError.DESCRIPTION)
            addAlert({ severity: "error", message: "Le nom est obligatoire", timeout: 5})
            return false
        }

        if (!dishPrice || Number(dishPrice) <= 0) {
            setInputError(InputError.PRICE)
            addAlert({ severity: "error", message: "Le prix doit être un nombre positif", timeout: 5 })
            return false
        }

        return true
    };

    async function handleOnCreateButton(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (validateForm()) {
            try {
                setIsLoadingCreationDish(true)
                await dishesRepository.create({
                    _id: "",
                    name: dishName,
                    ingredients: ingredientsDish.map((e): DishIngredientCreationDto => { 
                        return { ingredientId: e._id, unity: e.unity, quantity: e.value ?? 0 }
                     }),
                    price: Number(dishPrice),
                    description: dishDescription,
                    category: dishCategory,
                    isAvailable: false
                })
                reset()
                setIsLoadingCreationDish(false)
                handleOnClosePage()
                onClickOnConfirm()
            } catch(error) {
                addAlert({ severity: "error", message: "Une erreur est survenue lors de la création du plat", timeout: 10 })
            }
        }
    }

    return (
        <div className='flex flex-1 flex-col overflow-y-auto px-5 py-4 gap-4 z-50'>
            <TitleStyle>Mon plat</TitleStyle>
            {isLoading ?
                <div className="flex flex-1 items-center justify-center">
                    <CircularProgress/>
                </div>
                :
                <BorderContainer>
                    <div className='flex flex-col h-full px-5 py-6 justify-between items-center'>
                        <form className="flex flex-1 flex-col" onSubmit={handleOnCreateButton}>
                            <div className="flex flex-1 flex-col gap-3">
                                <TextInput name="dishName" label={"Nom"} value={dishName} onChange={(newValue) => { setDishName(newValue) }} $isError={inputError == InputError.NAME} />
                                <TextInput name="dishDescription" type="textarea" label={"Description"} value={dishDescription} onChange={(newValue) => { setDishDescription(newValue) }} $isError={inputError == InputError.DESCRIPTION} />
                                <TextfieldList valuesToDisplay={Object.values(DishCategory).map((e) => toCapitalize(e))} onClicked={handleOnClickOnCellCategory} label={"Catégorie"} />
                                <NumberInput name="dishPrice" label={"Prix"} value={dishPrice} onChange={(newValue) => setDishPrice(newValue)} $isError={inputError == InputError.PRICE}/>
                                <IngredientsLister
                                    ingredients={allIngredients} 
                                    currentIngredients={ingredientsDish}
                                    setCurrentIngredients={(ingredients) => { setIngredientsDish(ingredients) }}
                                    setIngredients={(ingredients) => { setAllIngredients(ingredients) }}
                                />
                            </div>
                            <div className="flex justify-between">
                                <CustomButton  type={TypeButton.TEXT} onClick={handleOnClosePage} width={WidthButton.SMALL} isLoading={false}>Annuler</CustomButton>
                                <CustomButton inputType="submit" type={TypeButton.PRIMARY} onClick={() => {}} width={WidthButton.SMALL} isLoading={isLoadingCreationDish}>Créer</CustomButton>
                            </div>
                        </form>
                    </div>
                </BorderContainer>}
        </div>
    )
}

export default AddDishPage