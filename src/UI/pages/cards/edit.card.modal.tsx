import { useState, useEffect } from 'react';
import { ConfirmationModal } from '../../components/modals/confirmation.modal';
import { TextInput } from '../../components/input/textInput';
import { DishesRepositoryImpl } from '../../../network/repositories/dishes.repository';
import { CardsRepositoryImpl } from '../../../network/repositories/cards.repository';
import { Dish } from '../../../data/models/dish.model';
import { CardDto } from '../../../data/dto/card.dto';
import { CircularProgress } from '@mui/material';
import { SearchInput } from '../../components/input/searchInput';

interface EditCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    card: CardDto;
    onCardUpdated: (card: CardDto) => void;
    onCardDeleted: (cardId: string) => void;
}

export const EditCardModal: React.FC<EditCardModalProps> = ({
    isOpen,
    onClose,
    card,
    onCardUpdated,
    onCardDeleted
}) => {
    const [name, setName] = useState(card.name);
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDishes, setSelectedDishes] = useState<Set<string>>(new Set(card.dishesId));
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [error, setError] = useState('');
    
    const dishesRepository = new DishesRepositoryImpl();
    const cardsRepository = new CardsRepositoryImpl();

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const fetchedDishes = await dishesRepository.getAll();
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
    }, [isOpen, dishesRepository]);

    const filteredDishes = dishes.filter(dish =>
        !searchQuery.trim() || dish.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleClose = () => {
        setName(card.name);
        setSelectedDishes(new Set(card.dishesId));
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
            const newSelection = new Set(selectedDishes);
            filteredDishes.forEach(dish => newSelection.delete(dish._id));
            setSelectedDishes(newSelection);
        } else {
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
            const updatedCard = await cardsRepository.update({
                _id: card._id,
                name: name.trim(),
                dishesId: Array.from(selectedDishes),
                isActive: card.isActive
            });
            
            onCardUpdated(updatedCard);
            handleClose();
        } catch (error) {
            setError("Erreur lors de la mise à jour de la carte");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        try {
            await onCardDeleted(card._id);
            handleClose();
        } catch (error) {
            setError("Erreur lors de la suppression de la carte");
        } finally {
            setIsSubmitting(false);
            setIsDeleteConfirmOpen(false);
        }
    };

    return (
        <>
            <ConfirmationModal
                modalName="edit-card-modal"
                isOpen={isOpen}
                onClose={handleClose}
            >
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Modifier la carte</h2>
                    
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

                        <div className="flex justify-between pt-4">
                            <button
                                onClick={() => setIsDeleteConfirmOpen(true)}
                                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            >
                                Supprimer
                            </button>
                            <div className="flex gap-3">
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
                                        'Modifier'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </ConfirmationModal>

            <ConfirmationModal
                modalName="delete-card-confirm-modal"
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
            >
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Confirmer la suppression</h2>
                    <p className="text-gray-600 mb-6">
                        Êtes-vous sûr de vouloir supprimer cette carte ? Cette action est irréversible.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setIsDeleteConfirmOpen(false)}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </ConfirmationModal>
        </>
    );
};