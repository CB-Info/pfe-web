import { useEffect, useState } from 'react';
import { BaseContent } from '../../components/contents/base.content';
import TitleStyle from '../../style/title.style';
import { CardDto } from '../../../data/dto/card.dto';
import { CardsRepositoryImpl } from '../../../network/repositories/cards.repository';
import { useAlerts } from '../../../contexts/alerts.context';
import { CircularProgress } from '@mui/material';
import { CreateCardModal } from './create.card.modal';
import { PanelContent } from '../../components/contents/panel.content';
import AddIcon from '@mui/icons-material/Add';
import { Switch } from '@headlessui/react';

export default function CardsPage() {
    const [cards, setCards] = useState<CardDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addAlert } = useAlerts();
    const cardsRepository = new CardsRepositoryImpl();

    const fetchCards = async () => {
        try {
            const fetchedCards = await cardsRepository.getAll();
            setCards(fetchedCards);
        } catch (error) {
            addAlert({
                severity: 'error',
                message: "Erreur lors de la récupération des cartes",
                timeout: 3
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const handleCardCreated = (newCard: CardDto) => {
        setCards(prevCards => [newCard, ...prevCards]);
        setIsModalOpen(false);
    };

    const handleToggleActive = async (card: CardDto) => {
        try {
            await cardsRepository.updateStatus(card._id, !card.isActive);
            await fetchCards();
            addAlert({
                severity: 'success',
                message: `La carte a été ${!card.isActive ? 'activée' : 'désactivée'}`,
                timeout: 3
            });
        } catch (error) {
            addAlert({
                severity: 'error',
                message: "Erreur lors de la mise à jour de la carte",
                timeout: 3
            });
        }
    };

    const activeCard = cards.find(card => card.isActive);
    const inactiveCards = cards.filter(card => !card.isActive);

    return (
        <BaseContent>
            <div className='flex flex-col px-6 py-8 gap-8'>
                <div className='flex justify-between items-center'>
                    <TitleStyle>Cartes</TitleStyle>
                </div>

                {isLoading ? (
                    <div className="flex flex-1 items-center justify-center">
                        <CircularProgress />
                    </div>
                ) : (
                    <div className='flex flex-col gap-8'>
                        {/* Carte active */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4">Carte actuellement utilisée</h2>
                            {activeCard ? (
                                <PanelContent>
                                    <CardItem 
                                        card={activeCard} 
                                        onToggleActive={handleToggleActive}
                                    />
                                </PanelContent>
                            ) : (
                                <p className="text-gray-500 italic">Aucune carte active</p>
                            )}
                        </section>

                        {/* Autres cartes */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4">Toutes les cartes</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Bouton Ajouter */}
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors duration-200"
                                >
                                    <AddIcon className="w-8 h-8 text-gray-400" />
                                </button>

                                {/* Liste des cartes inactives */}
                                {inactiveCards.map(card => (
                                    <PanelContent key={card._id}>
                                        <CardItem 
                                            card={card} 
                                            onToggleActive={handleToggleActive}
                                        />
                                    </PanelContent>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </div>

            <CreateCardModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCardCreated={handleCardCreated}
            />
        </BaseContent>
    );
}

interface CardItemProps {
    card: CardDto;
    onToggleActive: (card: CardDto) => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, onToggleActive }) => {
    return (
        <div className="p-4 flex flex-col h-48">
            <div className="flex-1">
                <div className="h-24 bg-gray-200 rounded-lg mb-3"></div>
                <h3 className="font-semibold text-lg mb-1">{card.name}</h3>
                <p className="text-sm text-gray-600">{card.dishesId.length} plats</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm text-gray-600">
                    {card.isActive ? 'Activée' : 'Désactivée'}
                </span>
                <Switch
                    checked={card.isActive}
                    onChange={() => onToggleActive(card)}
                    className={`${
                        card.isActive ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                    <span
                        className={`${
                            card.isActive ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                </Switch>
            </div>
        </div>
    );
};