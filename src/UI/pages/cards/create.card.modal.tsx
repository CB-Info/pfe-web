import { useState, useEffect } from 'react';
import { FullScreenModal } from '../../components/modals/full-screen-modal';
import { TextInput } from '../../components/input/textInput';
import { CardsRepositoryImpl } from '../../../network/repositories/cards.repository';
import { DishesRepositoryImpl } from '../../../network/repositories/dishes.repository';
import { useAlerts } from '../../../contexts/alerts.context';
import { Dish } from '../../../data/models/dish.model';
import { CardDto } from '../../../data/dto/card.dto';
import { CircularProgress } from '@mui/material';
import { EnhancedDishSelection } from '../../components/cards/dish-selection/enhanced-dish-selection.component';
import { Save, X } from 'lucide-react';

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
                setIsLoading(true);
                const fetchedDishes = await dishesRepository.getAll();
                setDishes(fetchedDishes);
            } catch (error) {
                setError("Erreur lors de la récupération des plats");
                addAlert({
                    severity: 'error',
                    message: "Erreur lors de la récupération des plats",
                    timeout: 5
                });
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
        // Validation
        if (!name.trim()) {
            setError("Le nom de la carte est requis");
            addAlert({
                severity: 'error',
                message: "Le nom de la carte est requis",
                timeout: 3
            });
            return;
        }
        
        if (selectedDishes.size === 0) {
            setError("Sélectionnez au moins un plat");
            addAlert({
                severity: 'error',
                message: "Sélectionnez au moins un plat pour créer la carte",
                timeout: 3
            });
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const newCard = await cardsRepository.create({
                name: name.trim(),
                dishesId: Array.from(selectedDishes),
                isActive: false
            });
            
            addAlert({
                severity: 'success',
                message: `La carte "${newCard.name}" a été créée avec succès`,
                timeout: 3
            });
            
            onCardCreated(newCard);
            handleClose();
        } catch (error) {
            const errorMessage = "Erreur lors de la création de la carte";
            setError(errorMessage);
            addAlert({
                severity: 'error',
                message: errorMessage,
                timeout: 5
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FullScreenModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Créer une nouvelle carte"
            maxWidth="6xl"
        >
            <div className="flex flex-col h-full">
                {/* Form Section */}
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <div className="max-w-md">
                        <TextInput
                            name="cardName"
                            label="Nom de la carte"
                            value={name}
                            onChange={setName}
                            $isError={!!error && !name.trim()}
                            $isDisabled={isSubmitting}
                        />
                        
                        {error && (
                            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Dish Selection Section */}
                <div className="flex-1 p-6 overflow-hidden">
                    <div className="h-full">
                        <EnhancedDishSelection
                            dishes={dishes}
                            selectedDishIds={selectedDishes}
                            onSelectionChange={setSelectedDishes}
                            isLoading={isLoading}
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            {selectedDishes.size > 0 && (
                                <span>
                                    {selectedDishes.size} plat{selectedDishes.size > 1 ? 's' : ''} sélectionné{selectedDishes.size > 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <X className="w-4 h-4" />
                                Annuler
                            </button>
                            
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !name.trim() || selectedDishes.size === 0}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                            >
                                {isSubmitting ? (
                                    <>
                                        <CircularProgress size={16} color="inherit" />
                                        Création en cours...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Créer la carte
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </FullScreenModal>
    );
};