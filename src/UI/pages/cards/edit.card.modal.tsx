import { useState, useEffect } from 'react';
import { ConfirmationModal } from '../../components/modals/confirmation.modal';
import { TextInput } from '../../components/input/textInput';
import { CardsRepositoryImpl } from '../../../network/repositories/cards.repository';
import { DishesRepositoryImpl } from '../../../network/repositories/dishes.repository';
import { useAlerts } from '../../../contexts/alerts.context';
import { Dish } from '../../../data/models/dish.model';
import { CardDto } from '../../../data/dto/card.dto';
import { CircularProgress } from '@mui/material';
import { EnhancedDishSelection } from '../../components/cards/dish-selection/enhanced-dish-selection.component';

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
    const [selectedDishes, setSelectedDishes] = useState<Set<string>>(new Set(card.dishesId));
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [error, setError] = useState('');

    useAlerts();
    const dishesRepository = new DishesRepositoryImpl();
    const cardsRepository = new CardsRepositoryImpl();

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const fetchedDishes = await dishesRepository.getAll();
                setDishes(fetchedDishes);
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

    const handleClose = () => {
        setName(card.name);
        setSelectedDishes(new Set(card.dishesId));
        setError('');
        onClose();
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

                        <EnhancedDishSelection
                            dishes={dishes}
                            selectedDishIds={selectedDishes}
                            onSelectionChange={setSelectedDishes}
                            isLoading={isLoading}
                        />

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
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <CircularProgress size={16} color="inherit" />
                                            Modification...
                                        </div>
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