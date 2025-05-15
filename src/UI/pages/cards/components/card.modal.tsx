import { useState } from 'react';
import { Card } from '../../../../data/models/card.model';
import { Dish } from '../../../../data/models/dish.model';
import { ConfirmationModal } from '../../../components/modals/confirmation.modal';
import { TextInput } from '../../../components/input/textInput';
import { CardsRepositoryImpl } from '../../../../network/repositories/cards.repository';
import { useAlerts } from '../../../../contexts/alerts.context';
import CustomButton, { TypeButton, WidthButton } from '../../../components/buttons/custom.button';

interface CardModalProps {
    card?: Card;
    dishes: Dish[];
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

export const CardModal: React.FC<CardModalProps> = ({
    card,
    dishes,
    isOpen,
    onClose,
    onSubmit
}) => {
    const [name, setName] = useState(card?.name ?? '');
    const [selectedDishes, setSelectedDishes] = useState<string[]>(
        card?.dishes.map(d => d._id) ?? []
    );
    const [isActive, setIsActive] = useState(card?.isActive ?? false);
    const [isLoading, setIsLoading] = useState(false);
    
    const { addAlert } = useAlerts();
    const cardsRepository = new CardsRepositoryImpl();

    const handleSubmit = async () => {
        if (!name.trim()) {
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

        try {
            setIsLoading(true);
            const cardData = {
                name: name.trim(),
                dishes: selectedDishes, // This is already an array of strings (dish IDs)
                isActive
            };

            if (card) {
                await cardsRepository.update(card._id, cardData);
                addAlert({ 
                    severity: 'success', 
                    message: 'Carte modifiée avec succès',
                    timeout: 5
                });
            } else {
                await cardsRepository.create(cardData);
                addAlert({ 
                    severity: 'success', 
                    message: 'Carte créée avec succès',
                    timeout: 5
                });
            }
            onSubmit();
            onClose();
        } catch (error) {
            console.error('Error handling card:', error);
            addAlert({ 
                severity: 'error', 
                message: `Erreur lors de la ${card ? 'modification' : 'création'} de la carte`,
                timeout: 5
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ConfirmationModal
            modalName="card-modal"
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="flex flex-col w-full gap-6 px-4">
                <h2 className="text-xl font-semibold">
                    {card ? 'Modifier la carte' : 'Nouvelle carte'}
                </h2>
                
                <TextInput
                    name="name"
                    label="Nom de la carte"
                    value={name}
                    onChange={setName}
                    $isError={false}
                    $isDisabled={false}
                />

                <div className="space-y-2">
                    <label className="font-medium">Plats disponibles</label>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                        {dishes.map((dish) => (
                            <div key={dish._id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={selectedDishes.includes(dish._id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedDishes([...selectedDishes, dish._id]);
                                        } else {
                                            setSelectedDishes(selectedDishes.filter(id => id !== dish._id));
                                        }
                                    }}
                                    className="rounded"
                                />
                                <span>{dish.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <label className="font-medium">Actif</label>
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="toggle"
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    <CustomButton
                        type={TypeButton.TEXT}
                        onClick={onClose}
                        width={WidthButton.SMALL}
                        isLoading={false}
                    >
                        Annuler
                    </CustomButton>
                    <CustomButton
                        type={TypeButton.PRIMARY}
                        onClick={handleSubmit}
                        width={WidthButton.SMALL}
                        isLoading={isLoading}
                    >
                        {card ? 'Modifier' : 'Créer'}
                    </CustomButton>
                </div>
            </div>
        </ConfirmationModal>
    );
};