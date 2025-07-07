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
import { Eye, Pencil, QrCode } from 'lucide-react';
import StyleRoundedIcon from '@mui/icons-material/StyleRounded';
import { ConfirmationModal } from '../../components/modals/confirmation.modal';
import { DishesRepositoryImpl } from '../../../network/repositories/dishes.repository';
import { Dish } from '../../../data/models/dish.model';
import { EditCardModal } from './edit.card.modal';
import { CustomerViewModal } from '../../components/cards/customer-view/customer-view-modal.component';

export default function CardsPage() {
    const [cards, setCards] = useState<CardDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState<CardDto | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isCustomerViewOpen, setIsCustomerViewOpen] = useState(false);
    const [cardDishes, setCardDishes] = useState<Dish[]>([]);
    const { addAlert } = useAlerts();
    const cardsRepository = new CardsRepositoryImpl();
    const dishesRepository = new DishesRepositoryImpl();

    const fetchCards = async () => {
        try {
            const fetchedCards = await cardsRepository.getAll();
            const sortedCards = fetchedCards.sort((a, b) => 
                new Date(b.dateOfCreation).getTime() - new Date(a.dateOfCreation).getTime()
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
        setIsCreateModalOpen(false);
    };

    const handleCardUpdated = (updatedCard: CardDto) => {
        setCards(prevCards => prevCards.map(card => 
            card._id === updatedCard._id ? updatedCard : card
        ));
        setIsEditModalOpen(false);
        addAlert({
            severity: 'success',
            message: "La carte a été mise à jour avec succès",
            timeout: 3
        });
    };

    const handleCardDeleted = async (cardId: string) => {
        try {
            await cardsRepository.delete(cardId);
            setCards(prevCards => prevCards.filter(card => card._id !== cardId));
            setIsEditModalOpen(false);
            addAlert({
                severity: 'success',
                message: "La carte a été supprimée avec succès",
                timeout: 3
            });
        } catch (error) {
            addAlert({
                severity: 'error',
                message: "Erreur lors de la suppression de la carte",
                timeout: 3
            });
        }
    };

    const handleToggleActive = async (card: CardDto) => {
        try {
            const activeCard = cards.find(c => c.isActive);
            
            if (!card.isActive && activeCard) {
                addAlert({
                    severity: 'error',
                    message: `Impossible d'activer la carte "${card.name}". La carte "${activeCard.name}" est déjà active. Veuillez d'abord la désactiver.`,
                    timeout: 5
                });
                return;
            }

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

    const handleViewCard = async (card: CardDto) => {
        setSelectedCard(card);
        setIsViewModalOpen(true);
        try {
            const allDishes = await dishesRepository.getAll();
            const cardDishes = allDishes.filter(dish => card.dishesId.includes(dish._id));
            setCardDishes(cardDishes);
        } catch (error) {
            addAlert({
                severity: 'error',
                message: "Erreur lors de la récupération des plats",
                timeout: 3
            });
        }
    };

    const handleCustomerView = (card: CardDto) => {
        setSelectedCard(card);
        setIsCustomerViewOpen(true);
    };

    const handleEditCard = (card: CardDto) => {
        setSelectedCard(card);
        setIsEditModalOpen(true);
    };

    const activeCard = cards.find(card => card.isActive);
    const inactiveCards = cards.filter(card => !card.isActive);

    return (
        <BaseContent>
            <div className="flex flex-col h-full">
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border-b border-gray-200 px-6 py-6 flex-shrink-0"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <StyleRoundedIcon className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <TitleStyle className="text-2xl">Gestion des cartes</TitleStyle>
                                <p className="text-gray-600 text-sm mt-1">
                                    Créez et gérez vos cartes de menu
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content - Scrollable */}
                <div className="flex-1 overflow-y-auto bg-gray-50">
                    {isLoading ? (
                        <div className="flex flex-1 items-center justify-center h-full">
                            <div className="text-center">
                                <CircularProgress className="mb-4" />
                                <p className="text-gray-600">Chargement des cartes...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 space-y-8">
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
                                                    onView={handleViewCard}
                                                    onEdit={handleEditCard}
                                                    onCustomerView={handleCustomerView}
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

                            <section>
                                <h2 className="text-xl font-semibold mb-4">Toutes les cartes</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setIsCreateModalOpen(true)}
                                        className="h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-all duration-200 hover:shadow-md"
                                    >
                                        <AddIcon className="w-8 h-8 text-gray-400" />
                                    </motion.button>

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
                                                        onView={handleViewCard}
                                                        onEdit={handleEditCard}
                                                        onCustomerView={handleCustomerView}
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
            </div>

            <CreateCardModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCardCreated={handleCardCreated}
            />

            {selectedCard && (
                <>
                    <EditCardModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        card={selectedCard}
                        onCardUpdated={handleCardUpdated}
                        onCardDeleted={handleCardDeleted}
                    />

                    <ConfirmationModal
                        modalName="view-card-modal"
                        isOpen={isViewModalOpen}
                        onClose={() => setIsViewModalOpen(false)}
                    >
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-6">
                                {selectedCard.name}
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium mb-2">Plats de la carte</h3>
                                    {cardDishes.length > 0 ? (
                                        <ul className="space-y-2">
                                            {cardDishes.map(dish => (
                                                <li key={dish._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                    <span>{dish.name}</span>
                                                    <span className="text-gray-600">{dish.price} €</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 italic">Aucun plat dans cette carte</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ConfirmationModal>

                    <CustomerViewModal
                        isOpen={isCustomerViewOpen}
                        onClose={() => setIsCustomerViewOpen(false)}
                        card={selectedCard}
                    />
                </>
            )}
        </BaseContent>
    );
}

interface CardItemProps {
    card: CardDto;
    onToggleActive: (card: CardDto) => void;
    onView: (card: CardDto) => void;
    onEdit: (card: CardDto) => void;
    onCustomerView: (card: CardDto) => void;
    isActive: boolean;
}

const CardItem: React.FC<CardItemProps> = ({ card, onToggleActive, onView, onEdit, onCustomerView, isActive }) => {
    const formattedDate = new Date(card.dateOfCreation).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className={`p-4 flex flex-col h-48 transition-all duration-300 relative group ${isActive ? 'bg-blue-50' : ''}`}>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 gap-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(card);
                    }}
                    className="p-3 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 transition-colors duration-200 z-10"
                >
                    <Eye className="w-5 h-5 text-gray-600" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onCustomerView(card);
                    }}
                    className="p-3 bg-blue-100 rounded-full shadow-md hover:bg-blue-200 transition-colors duration-200 z-10"
                    title="Aperçu client"
                >
                    <QrCode className="w-5 h-5 text-blue-600" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(card);
                    }}
                    className="p-3 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 transition-colors duration-200 z-10"
                >
                    <Pencil className="w-5 h-5 text-gray-600" />
                </button>
                <div className="absolute inset-0 bg-white bg-opacity-50"></div>
            </div>
            
            <div className="flex-1">
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