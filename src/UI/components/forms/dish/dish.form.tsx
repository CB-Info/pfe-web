import { FormEvent, useEffect, useState, useMemo } from "react";
import BorderContainer from "../../../style/border.container.style";
import { TextInput } from "../../input/textInput";
import TextfieldList from "../../input/textfield.list";
import CustomButton, { TypeButton, WidthButton } from "../../buttons";
import TitleStyle from "../../../style/title.style";
import IngredientsLister from "../../ingredientsLister/ingredients.lister";
import { Ingredient } from "../../../../data/models/ingredient.model";
import { NumberInput } from "../../input/number.input";
import { CircularProgress } from "@mui/material";
import { DishesRepositoryImpl } from "../../../../network/repositories/dishes.repository";
import {
  DishCategory,
  DishCategoryLabels,
} from "../../../../data/dto/dish.dto";
import { useAlerts } from "../../../../hooks/useAlerts";
import { DishIngredientCreationDto } from "../../../../data/dto/dish.creation.dto";
import { DishFormProps, DishFormMode } from "./dish.form.props";

enum InputError {
  NAME,
  DESCRIPTION,
  PRICE,
}

const DishForm: React.FC<DishFormProps> = ({
  mode,
  dish,
  onSubmitSuccess,
  onCancel,
}) => {
  const [dishName, setDishName] = useState(
    mode === DishFormMode.UPDATE && dish ? dish.name : ""
  );
  const [dishDescription, setDishDescription] = useState(
    mode === DishFormMode.UPDATE && dish ? dish.description : ""
  );
  const [dishPrice, setDishPrice] = useState(
    mode === DishFormMode.UPDATE && dish ? String(dish.price) : ""
  );
  const [dishCategory, setDishCategory] = useState<DishCategory>(
    mode === DishFormMode.UPDATE && dish
      ? dish.category
      : DishCategory.MAIN_DISHES
  );

  const defaultIngredients =
    mode === DishFormMode.UPDATE && dish
      ? dish.ingredients.map(
          (ing) =>
            new Ingredient(
              ing.ingredient._id,
              ing.ingredient.name,
              ing.unity,
              ing.quantity
            )
        )
      : [];

  const [ingredientsDish, setIngredientsDish] =
    useState<Ingredient[]>(defaultIngredients);
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCreationDish, setIsLoadingCreationDish] = useState(false);
  const [inputError, setInputError] = useState<InputError | undefined>(
    undefined
  );

  const dishesRepository = useMemo(() => new DishesRepositoryImpl(), []);
  const { addAlert, clearAlerts } = useAlerts();

  useEffect(() => {
    const fetchAllIngredientsData = async () => {
      try {
        const response = await dishesRepository.getTopIngredients();
        setAllIngredients(response);
      } catch {
        addAlert({
          severity: "error",
          message:
            "Une erreur est survenue lors de la récupération des données",
          timeout: 10,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllIngredientsData();
  }, []);

  function resetForm() {
    setDishName("");
    setDishDescription("");
    setDishPrice("");
    setIngredientsDish([]);
    setDishCategory(DishCategory.MAIN_DISHES);
    setInputError(undefined);
    clearAlerts();
  }

  function handleOnClickOnCellCategory(categoryLabel: string) {
    const category = Object.entries(DishCategoryLabels).find(
      ([, label]) => label === categoryLabel
    );
    if (category) {
      setDishCategory(category[0] as DishCategory);
    }
  }

  const validateForm = (): boolean => {
    if (!dishName) {
      setInputError(InputError.NAME);
      addAlert({
        severity: "error",
        message: "Le nom est obligatoire",
        timeout: 5,
      });
      return false;
    }
    if (!dishDescription) {
      setInputError(InputError.DESCRIPTION);
      addAlert({
        severity: "error",
        message: "La description est obligatoire",
        timeout: 5,
      });
      return false;
    }
    if (!dishPrice || Number(dishPrice) <= 0) {
      setInputError(InputError.PRICE);
      addAlert({
        severity: "error",
        message: "Le prix doit être un nombre positif",
        timeout: 5,
      });
      return false;
    }
    return true;
  };

  async function handleOnSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validateForm()) return;
    setIsLoadingCreationDish(true);

    try {
      const payload = {
        _id: mode === DishFormMode.UPDATE && dish ? dish._id : "",
        name: dishName,
        ingredients: ingredientsDish.map(
          (ing): DishIngredientCreationDto => ({
            ingredientId: ing._id,
            unity: ing.unity,
            quantity: ing.value ?? 0,
          })
        ),
        price: Number(dishPrice),
        description: dishDescription,
        category: dishCategory,
        isAvailable: false,
      };

      let successMessage = "";

      if (mode === DishFormMode.CREATE) {
        await dishesRepository.create(payload);
        successMessage = `Le plat "${payload.name}" a été créé avec succès`;
      } else {
        await dishesRepository.update(payload);
        successMessage = `Le plat "${payload.name}" a été mis à jour avec succès`;
      }

      resetForm();
      addAlert({ severity: "success", message: successMessage, timeout: 3 });
      setIsLoadingCreationDish(false);
      onSubmitSuccess();
    } catch (error) {
      addAlert({
        severity: "error",
        message: "Une erreur est survenue lors de la sauvegarde du plat",
        timeout: 10,
      });
      setIsLoadingCreationDish(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 py-4 gap-4 z-50">
      <TitleStyle>Mon plat</TitleStyle>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <CircularProgress />
        </div>
      ) : (
        <BorderContainer>
          <div className="flex flex-col h-full px-5 py-6 justify-between items-center">
            <form className="flex flex-1 flex-col" onSubmit={handleOnSubmit}>
              <div className="flex flex-1 flex-col gap-3">
                <TextInput
                  name="dishName"
                  label={"Nom"}
                  value={dishName}
                  onChange={(newValue) => setDishName(newValue)}
                  $isError={inputError === InputError.NAME}
                  $isDisabled={false}
                />
                <TextInput
                  name="dishDescription"
                  type="textarea"
                  label={"Description"}
                  value={dishDescription}
                  onChange={(newValue) => setDishDescription(newValue)}
                  $isError={inputError === InputError.DESCRIPTION}
                  $isDisabled={false}
                />
                <TextfieldList
                  valuesToDisplay={Object.values(DishCategoryLabels)}
                  onClicked={handleOnClickOnCellCategory}
                  label={"Catégorie"}
                  defaultValue={DishCategoryLabels[dishCategory]}
                />
                <NumberInput
                  name="dishPrice"
                  label={"Prix"}
                  value={dishPrice}
                  onChange={(newValue) => setDishPrice(newValue)}
                  $isError={inputError === InputError.PRICE}
                  $isDisabled={false}
                />
                <IngredientsLister
                  ingredients={allIngredients}
                  currentIngredients={ingredientsDish}
                  setCurrentIngredients={(ings) => setIngredientsDish(ings)}
                  setIngredients={(ings) => setAllIngredients(ings)}
                />
              </div>
              <div className="flex justify-between mt-4">
                <CustomButton
                  type={TypeButton.TEXT}
                  onClick={onCancel}
                  width={WidthButton.SMALL}
                  isLoading={false}
                >
                  Annuler
                </CustomButton>
                <CustomButton
                  inputType="submit"
                  type={TypeButton.PRIMARY}
                  onClick={() => {}}
                  width={WidthButton.SMALL}
                  isLoading={isLoadingCreationDish}
                >
                  {mode === DishFormMode.CREATE ? "Créer" : "Modifier"}
                </CustomButton>
              </div>
            </form>
          </div>
        </BorderContainer>
      )}
    </div>
  );
};

export default DishForm;
