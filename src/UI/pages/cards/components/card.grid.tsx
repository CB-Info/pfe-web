import { Card } from "../../../../data/models/card.model";
import styled from "styled-components";
import tw from "twin.macro";
import { ConfirmationModal } from "../../../components/modals/confirmation.modal";
import { useState } from "react";
import ModalButton from "../../../style/modal.button";

const GridContainer = styled.div`
    ${tw`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3`}
`;

const CardContainer = styled.div`
    ${tw`bg-white rounded-lg shadow-md p-6 relative transition-all duration-200 hover:shadow-lg`}
`;

const AddCardButton = styled.button`
    ${tw`border-2 border-dashed border-gray-300 rounded-lg p-6 w-full h-full min-h-[200px] flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors duration-200`}
`;

interface CardGridProps {
    cards: Card[];
    onCreateCard: () => void;
    onEditCard: (card: Card) => void;
    onDeleteCard: (cardId: string) => void;
}

export const CardGrid: React.FC<CardGridProps> = ({
    cards,
    onCreateCard,
    onEditCard,
    onDeleteCard,
}) => {
    const [cardToDelete, setCardToDelete] = useState<Card | null>(null);

    return (
        <>
            <GridContainer>
                <AddCardButton onClick={onCreateCard}>
                    <span className="text-2xl">+</span>
                </AddCardButton>
                {cards.map((card) => (
                    <CardContainer key={card._id}>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold">{card.name}</h3>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => onEditCard(card)}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    Modifier
                                </button>
                                <button
                                    onClick={() => setCardToDelete(card)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-gray-600">
                                {card.dishes.length} plat{card.dishes.length > 1 ? 's' : ''}
                            </p>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm">Status:</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    card.isActive 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {card.isActive ? 'Actif' : 'Inactif'}
                                </span>
                            </div>
                        </div>
                    </CardContainer>
                ))}
            </GridContainer>

            {cardToDelete && (
                <ConfirmationModal
                    modalName="delete-card-modal"
                    isOpen={true}
                    onClose={() => setCardToDelete(null)}
                >
                    <div className="flex flex-col flex-1 justify-center items-center px-6 gap-2">
                        <span className="font-inter text-base text-center px-1">
                            Êtes-vous sûr de vouloir supprimer cette carte ?
                        </span>
                        <div className="flex flex-col w-full">
                            <ModalButton
                                isErrorColors={true}
                                onClick={() => {
                                    onDeleteCard(cardToDelete._id);
                                    setCardToDelete(null);
                                }}
                            >
                                Supprimer
                            </ModalButton>
                            <ModalButton onClick={() => setCardToDelete(null)}>
                                Annuler
                            </ModalButton>
                        </div>
                    </div>
                </ConfirmationModal>
            )}
        </>
    );
};