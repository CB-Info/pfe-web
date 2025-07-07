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
import { Eye, Pencil, Search, Filter, Calendar, CheckCircle, Clock, Star } from 'lucide-react';
import { ConfirmationModal } from '../../components/modals/confirmation.modal';
import { DishesRepositoryImpl } from '../../../network/repositories/dishes.repository';
import { Dish } from '../../../data/models/dish.model';
import { EditCardModal } from './edit.card.modal';

export default function CardsPage() {
    const [cards, setCards] = useState<CardDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState<CardDto | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [cardDishes, setCardDishes] = useState<Dish[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [sortBy, setSortBy] = useState<'name' | 'date' | 'dishes'>('date');
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

    const handleEditCard = (card: CardDto) => {
        setSelectedCard(card);
        setIsEditModalOpen(true);
    };

    // Filtrage et tri des cartes
    const filteredAndSortedCards = cards
        .filter(card => {
            const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filterStatus === 'all' || 
                (filterStatus === 'active' && card.isActive) ||
                (filterStatus === 'inactive' && !card.isActive);
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'dishes':
                    return b.dishesId.length - a.dishesId.length;
                case 'date':
                default:
                    return new Date(b.dateOfCreation).getTime() - new Date(a.dateOfCreation).getTime();
            }
        });

    const activeCard = cards.find(card => card.isActive);
    const inactiveCards = filteredAndSortedCards.filter(card => !card.isActive);

    return (
        <BaseContent>
            <div className='flex flex-col px-6 py-8 gap-8'>
                {/* Header avec statistiques */}
                <div className='flex flex-col gap-6'>
                    <div className='flex justify-between items-start'>
                        <div>
                            <TitleStyle>Gestion des cartes</TitleStyle>
                            <p className="text-gray-600 mt-2">
                                Gérez vos cartes de menu et organisez vos plats
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                        >
                            <AddIcon className="w-5 h-5" />
                            Nouvelle carte
                        </motion.button>
                    </div>

                    {/* Statistiques rapides */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <PanelContent>
                                <div className="p-4 flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{cards.length}</p>
                                        <p className="text-sm text-gray-600">Total cartes</p>
                                    </div>
                                </div>
                            </PanelContent>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <PanelContent>
                                <div className="p-4 flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {cards.filter(c => c.isActive).length}
                                        </p>
                                        <p className="text-sm text-gray-600">Carte active</p>
                                    </div>
                                </div>
                            </PanelContent>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <PanelContent>
                                <div className="p-4 flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <Clock className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {cards.filter(c => !c.isActive).length}
                                        </p>
                                        <p className="text-sm text-gray-600">En attente</p>
                                    </div>
                                </div>
                            </PanelContent>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <PanelContent>
                                <div className="p-4 flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Star className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {Math.round(cards.reduce((acc, card) => acc + card.dishesId.length, 0) / (cards.length || 1))}
                                        </p>
                                        <p className="text-sm text-gray-600">Plats/carte</p>
                                    </div>
                                </div>
                            </PanelContent>
                        </motion.div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-1 items-center justify-center py-20">
                        <div className="text-center">
                            <CircularProgress />
                            <p className="mt-4 text-gray-600">Chargement des cartes...</p>
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-col gap-8'>
                        {/* Carte active - Section mise en avant */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Star className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Carte actuellement utilisée</h2>
                                    <p className="text-sm text-gray-600">Cette carte est visible par vos clients</p>
                                </div>
                            </div>
                            
                            <AnimatePresence mode="wait">
                                {activeCard ? (
                                    <motion.div
                                        key="active-card"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="max-w-2xl"
                                    >
                                        <div className="relative">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl blur opacity-25"></div>
                                            <PanelContent>
                                                <ActiveCardItem 
                                                    card={activeCard} 
                                                    onToggleActive={handleToggleActive}
                                                    onView={handleViewCard}
                                                    onEdit={handleEditCard}
                                                />
                                            </PanelContent>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="no-active-card"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="max-w-2xl"
                                    >
                                        <PanelContent>
                                            <div className="p-8 text-center">
                                                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                                    <Clock className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune carte active</h3>
                                                <p className="text-gray-600 mb-4">Activez une carte pour qu'elle soit visible par vos clients</p>
                                                <button
                                                    onClick={() => setIsCreateModalOpen(true)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                                >
                                                    Créer une carte
                                                </button>
                                            </div>
                                        </PanelContent>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </section>

                        {/* Section de gestion des cartes */}
                        <section>
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold">Toutes les cartes</h2>
                                    <p className="text-sm text-gray-600">
                                        {filteredAndSortedCards.length} carte{filteredAndSortedCards.length > 1 ? 's' : ''} 
                                        {searchQuery && ` correspondant à "${searchQuery}"`}
                                    </p>
                                </div>

                                {/* Barre de recherche et filtres */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Rechercher une carte..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                                        />
                                    </div>

                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value as any)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="all">Toutes</option>
                                        <option value="active">Actives</option>
                                        <option value="inactive">Inactives</option>
                                    </select>

                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="date">Date de création</option>
                                        <option value="name">Nom</option>
                                        <option value="dishes">Nombre de plats</option>
                                    </select>
                                </div>
                            </div>

                            {/* Grille des cartes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {/* Carte d'ajout - toujours en première position */}
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="h-64 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group"
                                >
                                    <div className="p-4 bg-gray-100 group-hover:bg-blue-100 rounded-full mb-4 transition-colors duration-300">
                                        <AddIcon className="w-8 h-8 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                                    </div>
                                    <p className="text-gray-600 group-hover:text-blue-600 font-medium transition-colors duration-300">
                                        Créer une nouvelle carte
                                    </p>
                                </motion.button>

                                {/* Cartes existantes */}
                                <AnimatePresence>
                                    {filteredAndSortedCards.filter(card => !card.isActive).map((card, index) => (
                                        <motion.div
                                            key={card._id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                            transition={{ 
                                                duration: 0.3,
                                                delay: index * 0.05
                                            }}
                                        >
                                            <PanelContent>
                                                <CardItem 
                                                    card={card} 
                                                    onToggleActive={handleToggleActive}
                                                    onView={handleViewCard}
                                                    onEdit={handleEditCard}
                                                />
                                            </PanelContent>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* État vide */}
                            {filteredAndSortedCards.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                        <Search className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune carte trouvée</h3>
                                    <p className="text-gray-600 mb-4">
                                        {searchQuery 
                                            ? `Aucune carte ne correspond à "${searchQuery}"`
                                            : "Créez votre première carte pour commencer"
                                        }
                                    </p>
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            Effacer la recherche
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </section>
                    </div>
                )}
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
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Eye className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">{selectedCard.name}</h2>
                                    <p className="text-sm text-gray-600">
                                        Créée le {new Date(selectedCard.dateOfCreation).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium mb-3 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Plats de la carte ({cardDishes.length})
                                    </h3>
                                    {cardDishes.length > 0 ? (
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {cardDishes.map(dish => (
                                                <div key={dish._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                                    <div>
                                                        <span className="font-medium">{dish.name}</span>
                                                        <p className="text-sm text-gray-600 truncate max-w-xs">
                                                            {dish.description}
                                                        </p>
                                                    </div>
                                                    <span className="text-blue-600 font-semibold">{dish.price} €</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            <p>Aucun plat dans cette carte</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ConfirmationModal>
                </>
            )}
        </BaseContent>
    );
}

interface ActiveCardItemProps {
    card: CardDto;
    onToggleActive: (card: CardDto) => void;
    onView: (card: CardDto) => void;
    onEdit: (card: CardDto) => void;
}

const ActiveCardItem: React.FC<ActiveCardItemProps> = ({ card, onToggleActive, onView, onEdit }) => {
    const formattedDate = new Date(card.dateOfCreation).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="p-6 relative group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">{card.name}</h3>
                        <p className="text-sm text-gray-600">Créée le {formattedDate}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onView(card);
                        }}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                        title="Voir les détails"
                    >
                        <Eye className="w-4 h-4 text-gray-600" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(card);
                        }}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                        title="Modifier"
                    >
                        <Pencil className="w-4 h-4 text-gray-600" />
                    </motion.button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Plats inclus</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900">{card.dishesId.length}</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Statut</span>
                    </div>
                    <p className="text-lg font-semibold text-blue-900">Active</p>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm font-medium text-green-600 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Carte actuellement utilisée
                </span>
                <Switch
                    checked={card.isActive}
                    onChange={() => onToggleActive(card)}
                    className={`${
                        card.isActive ? 'bg-green-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                >
                    <span
                        className={`${
                            card.isActive ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-lg`}
                    />
                </Switch>
            </div>
        </div>
    );
};

interface CardItemProps {
    card: CardDto;
    onToggleActive: (card: CardDto) => void;
    onView: (card: CardDto) => void;
    onEdit: (card: CardDto) => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, onToggleActive, onView, onEdit }) => {
    const formattedDate = new Date(card.dateOfCreation).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    return (
        <motion.div 
            className="p-5 h-64 flex flex-col relative group cursor-pointer"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
        >
            {/* Actions overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white bg-opacity-95 rounded-lg z-10">
                <div className="flex gap-3">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onView(card);
                        }}
                        className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors duration-200"
                        title="Voir les détails"
                    >
                        <Eye className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(card);
                        }}
                        className="p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg transition-colors duration-200"
                        title="Modifier"
                    >
                        <Pencil className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>

            {/* Contenu de la carte */}
            <div className="flex-1 group-hover:opacity-20 transition-opacity duration-300">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg text-gray-900 truncate pr-2">{card.name}</h3>
                    <div className={`w-3 h-3 rounded-full ${card.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>

                <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{card.dishesId.length} plat{card.dishesId.length > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{formattedDate}</span>
                    </div>
                </div>

                <div className="mt-auto">
                    <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                            card.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-600'
                        }`}>
                            {card.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <Switch
                            checked={card.isActive}
                            onChange={() => onToggleActive(card)}
                            className={`${
                                card.isActive ? 'bg-blue-600' : 'bg-gray-200'
                            } relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                        >
                            <span
                                className={`${
                                    card.isActive ? 'translate-x-5' : 'translate-x-1'
                                } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
                            />
                        </Switch>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};