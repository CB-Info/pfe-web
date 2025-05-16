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
import { motion, AnimatePresence } from 'framer-motion';

export default function CardsPage() {
    const [cards, setCards] = useState<CardDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addAlert } = useAlerts();
    const cardsRepository = new CardsRepositoryImpl();

    const fetchCards = async () => {
        try {
            const fetchedCards = await cardsRepository.getAll();
            // Tri par date de création (plus récente en premier)
            const sortedCards = fetchedCards.sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setCards(sortedCards);
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

    const activeCard = cards?.find(card => card.isActive);
    const inactiveCards = cards?.filter(card => !card.isActive) ?? [];

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
                        {/* Section carte active */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4">Carte actuellement utilisée</h2>
                            <AnimatePresence mode="wait">
                                {activeCard ? (
                                    <motion.div
                                        key="active-card"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <PanelContent>
                                            <CardItem 
                                                card={activeCard} 
                                                onToggleActive={handleToggleActive}
                                                isActive={true}
                                            />
                                        </PanelContent>
                                    </motion.div>
                                ) : (
                                    <motion.p
                                        key="no-active-card"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-gray-500 italic"
                                    >
                                        Aucune carte active
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </section>

                        {/* Section cartes inactives */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4">Toutes les cartes</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Bouton Ajouter */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsModalOpen(true)}
                                    className="h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-all duration-200 hover:shadow-md"
                                >
                                    <AddIcon className="w-8 h-8 text-gray-400" />
                                </motion.button>

                                {/* Liste des cartes inactives */}
                                <AnimatePresence>
                                    {inactiveCards.map(card => (
                                        <motion.div
                                            key={card._id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <PanelContent>
                                                <CardItem 
                                                    card={card} 
                                                    onToggleActive={handleToggleActive}
                                                    isActive={false}
                                                />
                                            </PanelContent>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
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
    isActive: boolean;
}

const CardItem: React.FC<CardItemProps> = ({ card, onToggleActive, isActive }) => {
    const formattedDate = new Date(card.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className={`p-4 flex flex-col h-48 transition-all duration-300 ${isActive ? 'bg-blue-50' : ''}`}>
            <div className="flex-1">
                <div className="h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Aperçu de la carte</span>
                </div>
                <h3 className="font-semibold text-lg mb-1">{card.name}</h3>
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">{card.dishesId.length} plats</p>
                    <p className="text-xs text-gray-500">{formattedDate}</p>
                </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
                <span className={`text-sm ${card.isActive ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
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