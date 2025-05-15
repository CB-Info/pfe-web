import { useEffect, useState } from 'react';
import { Card } from '../../../data/models/card.model';
import { CardsRepositoryImpl } from '../../../network/repositories/cards.repository';
import { DishesRepositoryImpl } from '../../../network/repositories/dishes.repository';
import { BaseContent } from '../../components/contents/base.content';
import { PanelContent } from '../../components/contents/panel.content';
import TitleStyle from '../../style/title.style';
import { CircularProgress, Switch } from '@mui/material';
import { useAlerts } from '../../../contexts/alerts.context';
import CustomButton, { TypeButton, WidthButton } from '../../components/buttons/custom.button';
import { TextInput } from '../../components/input/textInput';
import { Dish } from '../../../data/models/dish.model';

export default function CardsPage() {
    const [cards, setCards] = useState<Card[]>([]);
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newCardName, setNewCardName] = useState('');
    const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
    const { addAlert } = useAlerts();

    const cardsRepository = new CardsRepositoryImpl();
    const dishesRepository = new DishesRepositoryImpl();

    const fetchData = async () => {
        try {
            const dishesData = await dishesRepository.getAll();
            const cardsData = await cardsRepository.getAll(dishesData);
            setDishes(dishesData);
            setCards(cardsData);
        } catch (error) {
            addAlert({
                severity: 'error',
                message: "Erreur lors de la récupération des données",
                timeout: 5
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateCard = async () => {
        if (!newCardName.trim()) {
            addAlert({
                severity: 'error',
                message: "Le nom de la carte est requis",
                timeout: 5
            });
            return;
        }

        if (selectedDishes.length === 0) {
            addAlert({
                severity: 'error',
                message: "Veuillez sélectionner au moins un plat",
                timeout: 5
            });
            return;
        }

        setIsCreating(true);
        try {
            await cardsRepository.create(newCardName, selectedDishes);
            await fetchData();
            setNewCardName('');
            setSelectedDishes([]);
            setIsCreating(false);
            addAlert({
                severity: 'success',
                message: "Carte créée avec succès",
                timeout: 5
            });
        } catch (error) {
            addAlert({
                severity: 'error',
                message: "Erreur lors de la création de la carte",
                timeout: 5
            });
            setIsCreating(false);
        }
    };

    const handleActivateCard = async (cardId: string) => {
        try {
            await cardsRepository.setActive(cardId);
            await fetchData();
            addAlert({
                severity: 'success',
                message: "Statut de la carte mis à jour",
                timeout: 5
            });
        } catch (error) {
            addAlert({
                severity: 'error',
                message: "Erreur lors de la mise à jour du statut",
                timeout: 5
            });
        }
    };

    const toggleDishSelection = (dishId: string) => {
        setSelectedDishes(prev => 
            prev.includes(dishId)
                ? prev.filter(id => id !== dishId)
                : [...prev, dishId]
        );
    };

    if (isLoading) {
        return (
            <BaseContent>
                <div className="flex flex-1 items-center justify-center">
                    <CircularProgress />
                </div>
            </BaseContent>
        );
    }

    return (
        <BaseContent>
            <div className='flex justify-between px-6 pt-8 items-center'>
                <TitleStyle>Cartes</TitleStyle>
            </div>
            <div className='flex flex-col gap-6 p-6'>
                <PanelContent>
                    <div className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Créer une nouvelle carte</h2>
                        <div className="flex flex-col gap-4">
                            <TextInput
                                name="cardName"
                                label="Nom de la carte"
                                value={newCardName}
                                onChange={setNewCardName}
                                $isError={false}
                                $isDisabled={false}
                            />
                            <div>
                                <h3 className="text-sm font-medium mb-2">Sélectionner les plats</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {dishes.map(dish => (
                                        <div
                                            key={dish._id}
                                            className={`p-4 rounded-lg border cursor-pointer ${
                                                selectedDishes.includes(dish._id)
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200'
                                            }`}
                                            onClick={() => toggleDishSelection(dish._id)}
                                        >
                                            <p className="font-medium">{dish.name}</p>
                                            <p className="text-sm text-gray-500">{dish.price}€</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <CustomButton
                                    type={TypeButton.PRIMARY}
                                    onClick={handleCreateCard}
                                    width={WidthButton.SMALL}
                                    isLoading={isCreating}
                                >
                                    Créer la carte
                                </CustomButton>
                            </div>
                        </div>
                    </div>
                </PanelContent>

                <PanelContent>
                    <div className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Cartes existantes</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {cards.map(card => (
                                <div key={card._id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium">{card.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">
                                                {card.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                            <Switch
                                                checked={card.isActive}
                                                onChange={() => handleActivateCard(card._id)}
                                                color="primary"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {card.dishes.map(dish => (
                                            <div key={dish._id} className="text-sm p-2 bg-gray-50 rounded">
                                                {dish.name} - {dish.price}€
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </PanelContent>
            </div>
        </BaseContent>
    );
}