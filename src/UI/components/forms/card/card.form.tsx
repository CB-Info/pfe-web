import { FormEvent, useEffect, useState } from "react";
import BorderContainer from "../../../style/border.container.style";
import { TextInput } from "../../../components/input/textInput";
import CustomButton, { TypeButton, WidthButton } from "../../../components/buttons/custom.button";
import TitleStyle from "../../../style/title.style";
import { CircularProgress } from "@mui/material";
import { CardsRepositoryImpl } from "../../../../network/repositories/cards.repository";
import { useAlerts } from "../../../../contexts/alerts.context";
import { DishesRepositoryImpl } from "../../../../network/repositories/dishes.repository";
import { Dish } from "../../../../data/models/dish.model";
import { CardFormProps, CardFormMode } from "./card.form.props";

enum InputError {
  NAME = "NAME",
  DISHES = "DISHES"
}

const CardForm: React.FC<CardFormProps> = ({
  mode,
  onSubmitSuccess,
  onCancel,
}) => {
  const [cardName, setCardName] = useState("");
  const [selectedDishes, setSelectedDishes] = useState<Set<string>>(new Set());
  const [availableDishes, setAvailableDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCreation, setIsLoadingCreation] = useState(false);
  const [inputError, setInputError] = useState<InputError | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  const cardsRepository = new CardsRepositoryImpl();
  const dishesRepository = new DishesRepositoryImpl();
  const { addAlert, clearAlerts } = useAlerts();

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const dishes = await dishesRepository.getAll();
        setAvailableDishes(dishes);
      } catch {
        addAlert({
          severity: "error",
          message: "Une erreur est survenue lors de la récupération des plats",
          timeout: 10,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDishes();
  }, []);

  const filteredDishes = availableDishes.filter(dish =>
    dish.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function resetForm() {
    setCardName("");
    setSelectedDishes(new Set());
    setInputError(undefined);
    clearAlerts();
  }

  const validateForm = (): boolean => {
    if (!cardName.trim()) {
      setInputError(InputError.NAME);
      addAlert({ severity: "error", message: "Le nom est obligatoire", timeout: 5 });
      return false;
    }
    if (selectedDishes.size === 0) {
      setInputError(InputError.DISHES);
      addAlert({ severity: "error", message: "Sélectionnez au moins un plat", timeout: 5 });
      return false;
    }
    return true;
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validateForm()) return;
    setIsLoadingCreation(true);

    try {
      await cardsRepository.create({
        name: cardName.trim(),
        dishesId: Array.from(selectedDishes),
        isActive: false,
      });

      resetForm();
      setIsLoadingCreation(false);
      onSubmitSuccess();
    } catch (error) {
      addAlert({
        severity: "error",
        message: "Une erreur est survenue lors de la création de la carte",
        timeout: 10,
      });
      setIsLoadingCreation(false);
    }
  }

  const toggleDish = (dishId: string) => {
    const newSelection = new Set(selectedDishes);
    if (newSelection.has(dishId)) {
      newSelection.delete(dishId);
    } else {
      newSelection.add(dishId);
    }
    setSelectedDishes(newSelection);
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 py-4 gap-4">
      <TitleStyle>Nouvelle carte</TitleStyle>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <CircularProgress />
        </div>
      ) : (
        <BorderContainer>
          <div className="flex flex-col h-full px-5 py-6 justify-between items-center">
            <form className="flex flex-1 flex-col w-full" onSubmit={handleSubmit}>
              <div className="flex flex-1 flex-col gap-6">
                <TextInput
                  name="cardName"
                  label="Nom de la carte"
                  value={cardName}
                  onChange={(newValue) => setCardName(newValue)}
                  $isError={inputError === InputError.NAME}
                  $isDisabled={false}
                />

                <div className="flex flex-col gap-4">
                  <TextInput
                    name="searchDishes"
                    label="Rechercher un plat"
                    value={searchQuery}
                    onChange={setSearchQuery}
                    $isError={false}
                    $isDisabled={false}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sélection des plats
                    </label>
                    <div className="max-h-64 overflow-y-auto border rounded-lg divide-y">
                      {filteredDishes.map(dish => (
                        <label
                          key={dish._id}
                          className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedDishes.has(dish._id)}
                            onChange={() => toggleDish(dish._id)}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-3">{dish.name}</span>
                          <span className="ml-auto text-gray-500">{dish.price} €</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
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
                  isLoading={isLoadingCreation}
                >
                  {mode === CardFormMode.CREATE ? "Créer" : "Modifier"}
                </CustomButton>
              </div>
            </form>
          </div>
        </BorderContainer>
      )}
    </div>
  );
};

export default CardForm;