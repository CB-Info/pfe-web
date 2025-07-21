import { FormEvent, useEffect, useState, useMemo } from "react";
import BorderContainer from "../../../style/border.container.style";
import { TextInput } from "../../input/textInput";
import TextfieldList from "../../input/textfield.list";
import { CustomButton } from "../../buttons/custom.button";
import { TypeButton, WidthButton } from "../../buttons/button.types";
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
import { X, Save, ChefHat } from "lucide-react";
import { motion } from "framer-motion";

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

  const formTitle = mode === DishFormMode.CREATE ? "Nouveau plat" : "Modifier le plat";

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header avec titre et bouton fermer */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ChefHat className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{formTitle}</h2>
            <p className="text-sm text-gray-600">
              {mode === DishFormMode.CREATE 
                ? "Ajoutez un nouveau plat à votre menu" 
                : "Modifiez les informations de votre plat"
              }
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          aria-label="Fermer le formulaire"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </motion.div>

      {/* Contenu principal scrollable */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center h-full">
            <div className="text-center py-12">
              <CircularProgress className="mb-4" />
              <p className="text-gray-600">Chargement...</p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="p-4 space-y-6"
          >
            <form onSubmit={handleOnSubmit} className="space-y-6">
              {/* Section informations de base */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                  Informations générales
                </h3>
                
                {/* Grille responsive pour nom et prix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    name="dishName"
                    label="Nom du plat"
                    value={dishName}
                    onChange={(newValue) => {
                      setDishName(newValue);
                      if (inputError === InputError.NAME) setInputError(undefined);
                    }}
                    $isError={inputError === InputError.NAME}
                    $isDisabled={isLoadingCreationDish}
                  />
                  
                  <NumberInput
                    name="dishPrice"
                    label="Prix"
                    value={dishPrice}
                    onChange={(newValue) => {
                      setDishPrice(newValue);
                      if (inputError === InputError.PRICE) setInputError(undefined);
                    }}
                    $isError={inputError === InputError.PRICE}
                    $isDisabled={isLoadingCreationDish}
                  />
                </div>

                {/* Description sur toute la largeur */}
                <TextInput
                  name="dishDescription"
                  type="textarea"
                  label="Description"
                  value={dishDescription}
                  onChange={(newValue) => {
                    setDishDescription(newValue);
                    if (inputError === InputError.DESCRIPTION) setInputError(undefined);
                  }}
                  $isError={inputError === InputError.DESCRIPTION}
                  $isDisabled={isLoadingCreationDish}
                />

                {/* Catégorie */}
                <TextfieldList
                  valuesToDisplay={Object.values(DishCategoryLabels)}
                  onClicked={handleOnClickOnCellCategory}
                  label="Catégorie"
                  defaultValue={DishCategoryLabels[dishCategory]}
                />
              </div>

              {/* Section ingrédients */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                  Composition
                </h3>
                <IngredientsLister
                  ingredients={allIngredients}
                  currentIngredients={ingredientsDish}
                  setCurrentIngredients={(ings) => setIngredientsDish(ings)}
                  setIngredients={(ings) => setAllIngredients(ings)}
                />
              </div>
            </form>
          </motion.div>
        )}
      </div>

      {/* Footer avec boutons d'action */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50"
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
          <CustomButton
            type={TypeButton.TEXT}
            onClick={onCancel}
            width={WidthButton.MEDIUM}
            isLoading={false}
            isDisabled={isLoadingCreationDish}
            ariaLabel="Annuler la création du plat"
          >
            Annuler
          </CustomButton>
          
          <CustomButton
            inputType="submit"
            type={TypeButton.PRIMARY}
            onClick={async () => {
              const form = document.querySelector('form');
              if (form) {
                const event = new Event('submit', { bubbles: true, cancelable: true });
                form.dispatchEvent(event);
              }
            }}
            width={WidthButton.MEDIUM}
            isLoading={isLoadingCreationDish}
            isDisabled={isLoadingCreationDish}
            ariaLabel={mode === DishFormMode.CREATE ? "Créer le plat" : "Modifier le plat"}
          >
            <div className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {mode === DishFormMode.CREATE ? "Créer" : "Modifier"}
            </div>
          </CustomButton>
        </div>
        
        {/* Indicateur de progression sur mobile */}
        <div className="mt-3 sm:hidden">
          <div className="flex items-center justify-center text-xs text-gray-500">
            <span>Étape 1 sur 1 - Informations du plat</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DishForm;