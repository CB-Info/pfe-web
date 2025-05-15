import { FormEvent, useEffect, useState } from "react";
import BorderContainer from "../../../style/border.container.style";
import { TextInput } from "../../../components/input/textInput";
import TextfieldList from "../../../components/input/textfield.list";
import CustomButton, { TypeButton, WidthButton } from "../../../components/buttons/custom.button";
import TitleStyle from "../../../style/title.style";
import IngredientsLister from "../../../components/ingredientsLister/ingredients.lister";
import { Ingredient } from "../../../../data/models/ingredient.model";
import { NumberInput } from "../../../components/input/number.input";
import { CircularProgress } from "@mui/material";
import { DishesRepositoryImpl } from "../../../../network/repositories/dishes.repository";
import { DishCategory } from "../../../../data/dto/dish.dto";
import { toCapitalize } from "../../../../applications/extensions/string+extension";
import { useAlerts } from "../../../../contexts/alerts.context";
import { DishIngredientCreationDto } from "../../../../data/dto/dish.creation.dto";
import { DishFormProps, DishFormMode } from "./dish.form.props";
import { commonValidationRules, validateField, type ValidationRules } from "../../../../utils/validation";

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
}

const validationRules: ValidationRules = {
  name: [
    commonValidationRules.required,
    commonValidationRules.minLength(3),
    commonValidationRules.maxLength(50),
  ],
  description: [
    commonValidationRules.required,
    commonValidationRules.minLength(10),
    commonValidationRules.maxLength(500),
  ],
  price: [
    commonValidationRules.required,
    commonValidationRules.price,
  ],
};

const DishForm: React.FC<DishFormProps> = ({
  mode,
  dish,
  onSubmitSuccess,
  onCancel,
}) => {
  const [dishName, setDishName] = useState(mode === DishFormMode.UPDATE && dish ? dish.name : "");
  const [dishDescription, setDishDescription] = useState(mode === DishFormMode.UPDATE && dish ? dish.description : "");
  const [dishPrice, setDishPrice] = useState(mode === DishFormMode.UPDATE && dish ? String(dish.price) : "");
  const [dishCategory, setDishCategory] = useState<DishCategory>(mode === DishFormMode.UPDATE && dish ? dish.category : DishCategory.MEAT);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const defaultIngredients = mode === DishFormMode.UPDATE && dish
    ? dish.ingredients.map((ing) => new Ingredient(ing.ingredient._id, ing.ingredient.name, ing.unity, ing.quantity))
    : [];

  const [ingredientsDish, setIngredientsDish] = useState<Ingredient[]>(defaultIngredients);
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCreationDish, setIsLoadingCreationDish] = useState(false);

  const dishesRepository = new DishesRepositoryImpl();
  const { addAlert, clearAlerts } = useAlerts();

  useEffect(() => {
    const fetchAllIngredientsData = async () => {
      try {
        const response = await dishesRepository.getTopIngredients();
        setAllIngredients(response);
      } catch {
        addAlert({
          severity: "error",
          message: "Une erreur est survenue lors de la récupération des données",
          timeout: 10,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllIngredientsData();
  }, [addAlert, dishesRepository]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate each field
    Object.keys(validationRules).forEach((field) => {
      const value = field === 'price' ? dishPrice : field === 'name' ? dishName : dishDescription;
      const error = validateField(value, validationRules[field]);
      if (error) {
        newErrors[field as keyof FormErrors] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: keyof FormErrors) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (touched[field]) {
      const value = field === 'price' ? dishPrice : field === 'name' ? dishName : dishDescription;
      const error = validateField(value, validationRules[field]);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const resetForm = () => {
    setDishName("");
    setDishDescription("");
    setDishPrice("");
    setIngredientsDish([]);
    setDishCategory(DishCategory.MEAT);
    setErrors({});
    setTouched({});
    clearAlerts();
  };

  const handleOnClickOnCellCategory = (category: string) => {
    const upper = category.toUpperCase();
    if (upper in DishCategory) {
      setDishCategory(DishCategory[upper as keyof typeof DishCategory]);
    }
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

      if (mode === DishFormMode.CREATE) {
        await dishesRepository.create(payload);
      } else {
        await dishesRepository.update(payload);
      }

      resetForm();
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
            <form className="flex flex-1 flex-col w-full" onSubmit={handleOnSubmit}>
              <div className="flex flex-1 flex-col gap-3">
                <TextInput
                  name="dishName"
                  label="Nom"
                  value={dishName}
                  onChange={(newValue) => setDishName(newValue)}
                  onBlur={() => handleBlur('name')}
                  $isError={!!errors.name}
                  helperText={errors.name}
                  $isDisabled={false}
                  required
                />
                <TextInput
                  name="dishDescription"
                  type="textarea"
                  label="Description"
                  value={dishDescription}
                  onChange={(newValue) => setDishDescription(newValue)}
                  onBlur={() => handleBlur('description')}
                  $isError={!!errors.description}
                  helperText={errors.description}
                  $isDisabled={false}
                  required
                />
                <TextfieldList
                  valuesToDisplay={Object.values(DishCategory).map((cat) =>
                    toCapitalize(cat)
                  )}
                  onClicked={handleOnClickOnCellCategory}
                  label="Catégorie"
                />
                <NumberInput
                  name="dishPrice"
                  label="Prix"
                  value={dishPrice}
                  onChange={(newValue) => setDishPrice(newValue)}
                  onBlur={() => handleBlur('price')}
                  $isError={!!errors.price}
                  helperText={errors.price}
                  $isDisabled={false}
                  required
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