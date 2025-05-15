import { useEffect, useState } from 'react';
import { BaseContent } from '../../components/contents/base.content';
import TitleStyle from '../../style/title.style';
import { Card } from '../../../data/models/card.model';
import { CardsRepositoryImpl } from '../../../network/repositories/cards.repository';
import { useAlerts } from '../../../contexts/alerts.context';
import { CircularProgress } from '@mui/material';
import { DishesRepositoryImpl } from '../../../network/repositories/dishes.repository';
import { Dish } from '../../../data/models/dish.model';
import { CardGrid } from './components/card.grid';
import { CardModal } from './components/card.modal';

export default function CardsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [cards, setCards] = useState<Card[]>([]);
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [selectedCard, setSelectedCard] = useState<Card | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addAlert } = useAlerts();
    const cardsRepository = new CardsRepositoryImpl();
    const dishesRepository = new DishesRepositoryImpl();

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [cardsData, dishesData] = await Promise.all([
                cardsRepository.getAll(),
                dishesRepository.getAll()
            ]);
            setCards(cardsData);
            setDishes(dishesData);
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

    const handleCardCreate = () => {
        setSelectedCard(undefined);
        setIsModalOpen(true);
    };

    const handleCardEdit = (card: Card) => {
        setSelectedCard(card);
        setIsModalOpen(true);
    };

    const handleCardDelete = async (cardId: string) => {
        try {
            await cardsRepository.delete(cardId);
            await fetchData();
            addAlert({ 
                severity: 'success', 
                message: "Carte supprimée avec succès",
                timeout: 5
            });
        } catch (error) {
            addAlert({ 
                severity: 'error', 
                message: "Erreur lors de la suppression de la carte",
                timeout: 5
            });
        }
    };

    return (
        <BaseContent>
            <div className='flex justify-between px-6 pt-8 items-center'>
                <TitleStyle>Cartes</TitleStyle>
            </div>
            {isLoading ? (
                <div className="flex flex-1 items-center justify-center">
                    <CircularProgress />
                </div>
            ) : (
                <div className='flex flex-col px-6 py-4 gap-10'>
                    <CardGrid 
                        cards={cards}
                        onCreateCard={handleCardCreate}
                        onEditCard={handleCardEdit}
                        onDeleteCard={handleCardDelete}
                    />
                    {isModalOpen && (
                        <CardModal
                            card={selectedCard}
                            dishes={dishes}
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSubmit={async () => {
                                await fetchData();
                                setIsModalOpen(false);
                            }}
                        />
                    )}
                </div>
            )}
        </BaseContent>
    );
}