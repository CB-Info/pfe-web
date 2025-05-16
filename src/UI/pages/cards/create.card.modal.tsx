import { useState, useEffect, useMemo } from 'react';
import { ConfirmationModal } from '../../components/modals/confirmation.modal';
import { TextInput } from '../../components/input/textInput';
import { DishesRepositoryImpl } from '../../../network/repositories/dishes.repository';
import { CardsRepositoryImpl } from '../../../network/repositories/cards.repository';
import { useAlerts } from '../../../contexts/alerts.context';
import { Dish } from '../../../data/models/dish.model';
import { CardDto } from '../../../data/dto/card.dto';
import { CircularProgress } from '@mui/material';
import { SearchInput } from '../../components/input/searchInput';

interface CreateCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCardCreated: (card: CardDto) => void;
}

export const CreateCardModal: React.FC<CreateCardModalProps> = ({
    isOpen,
    onClose,
    onCardCreated
}) => {
    const [name, setName] = useState('');
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDishes, setSelectedDishes] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    
    const { addAlert } = useAlerts();
    const dishesRepository = new DishesRepositoryImpl();
    const cardsRepository = new CardsRepositoryImpl();

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const fetchedDishes = await dishesRepository.getAll();
                // Tri alphabétique des plats
                const sortedDishes = fetchedDishes.sort((a, b) => 
                    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
                );
                setDishes(sortedDishes);
            } catch (error) {
                setError("Erreur lors de la récupération des plats");
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            fetchDishes();
        }
    }, [isOpen]);

    // Filtrage des plats en fonction de la recherche
    const filteredDishes = useMemo(() => {
        if (!searchQuery.trim()) return dishes;
        
        return dishes.filter(dish => 
            dish.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [dishes, searchQuery]);

    const handleClose = () => {
        setName('');
        setSelectedDishes(new Set());
        setSearchQuery('');
        setError('');
        onClose();
    };

    const toggleDish = (dishId: string) => {
        const newSelection = new Set(selectedDishes);
        if (newSelection.has(dishId)) {
            newSelection.delete(dishId);
        } else {
            newSelection.add(dishId);
        }
        setSelectedDishes(newSelection);
    };

    const toggleAll = () => {
        if (selectedDishes.size === filteredDishes.length) {
            // Désélectionne uniquement les plats filtrés
            const newSelection = new Set(selectedDishes);
            filteredDishes.forEach(dish => newSelection.delete(dish._id));
            setSelectedDishes(newSelection);
        } else {
            // Sélectionne tous les plats filtrés
            const newSelection = new Set(selectedDishes);
            filteredDishes.forEach(dish => newSelection.add(dish._id));
            setSelectedDishes(newSelection);
        }
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError("Le nom de la carte est requis");
            return;
        }
        if (selectedDishes.size === 0) {
            setError("Sélectionnez au moins un plat");
            return;
        }

        setIsSubmitting(true);
        try {
            const newCard = await cardsRepository.create({
                name: name.trim(),
                dishesId: Array.from(selectedDishes),
                isActive: false
            });
            
            addAlert({
                severity: 'success',
                message: 'La carte a été créée avec succès',
                timeout: 3
            });
            
            onCardCreated(newCard);
            handleClose();
        } catch (error) {
            setError("Erreur lors de la création de la carte");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ConfirmationModal
            modalName="create-card-modal"
            isOpen={isOpen}
            onClose={handleClose}
        >
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Créer une nouvelle carte</h2>
                
                <div className="space-y-6">
                    <TextInput
                        name="cardName"
                        label="Nom de la carte"
                        value={name}
                        onChange={setName}
                        $isError={!!error && !name.trim()}
                        $isDisabled={false}
                    />

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <div>
                        <div className="flex flex-col gap-4">
                            <SearchInput
                                label="Rechercher un plat"
                                name="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                error={false}
                            />

                            <div className="flex justify-between items-center">
                                <h3 className="font-medium">Sélection des plats</h3>
                                <button
                                    onClick={toggleAll}
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    {selectedDishes.size === filteredDishes.length ? 'Tout décocher' : 'Sélectionner tout'}
                                </button>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-4">
                                <CircularProgress size={24} />
                            </div>
                        ) : filteredDishes.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                Aucun plat ne correspond à votre recherche
                            </div>
                        ) : (
                            <div className="max-h-64 overflow-y-auto border rounded-lg divide-y mt-2">
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
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !name.trim() || selectedDishes.size === 0}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                'Créer'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </ConfirmationModal>
    );
};