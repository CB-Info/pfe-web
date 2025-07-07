import { useState, useEffect, useMemo } from 'react';
import { ConfirmationModal } from '../../components/modals/confirmation.modal';
import { TextInput } from '../../components/input/textInput';
import { CardsRepositoryImpl } from '../../../network/repositories/cards.repository';
import { DishesRepositoryImpl } from '../../../network/repositories/dishes.repository';
import { useAlerts } from '../../../contexts/alerts.context';
import { Dish } from '../../../data/models/dish.model';
import { CardDto } from '../../../data/dto/card.dto';
import { CircularProgress } from '@mui/material';
import { EnhancedDishSelection } from '../../components/cards/dish-selection/enhanced-dish-selection.component';

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
        setName('');
        setSelectedDishes(new Set());
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

                    <EnhancedDishSelection
                        dishes={dishes}
                        selectedDishIds={selectedDishes}
                        onSelectionChange={setSelectedDishes}
                        isLoading={isLoading}
                    />

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
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <CircularProgress size={16} color="inherit" />
                                    Création...
                                </div>
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