import React, { useState, useMemo } from 'react';
import { CardDto } from '../../../data/dto/card.dto';
import { Dish } from '../../../data/models/dish.model';
import { DishCategoryLabels } from '../../../data/dto/dish.dto';
import { FullScreenModal } from '../modals/full-screen-modal';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  Tag, 
  TrendingUp,
  Eye,
  Grid,
  List,
  Filter,
  Search,
  ChefHat,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CardDetailsModalProps {
  card: CardDto | null;
  dishes: Dish[];
  isOpen: boolean;
  onClose: () => void;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'price' | 'category';

export const CardDetailsModal: React.FC<CardDetailsModalProps> = ({
  card,
  dishes,
  isOpen,
  onClose
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!card) return null;

  // Filter dishes that belong to this card
  const cardDishes = useMemo(() => {
    return dishes.filter(dish => card.dishesId.includes(dish._id));
  }, [dishes, card.dishesId]);

  // Apply filters and sorting
  const filteredAndSortedDishes = useMemo(() => {
    let filtered = cardDishes.filter(dish => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!dish.name.toLowerCase().includes(query) && 
            !dish.description.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && dish.category !== selectedCategory) {
        return false;
      }

      return true;
    });

    // Sort dishes
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [cardDishes, searchQuery, selectedCategory, sortOption]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalPrice = cardDishes.reduce((sum, dish) => sum + dish.price, 0);
    const averagePrice = cardDishes.length > 0 ? totalPrice / cardDishes.length : 0;
    const availableDishes = cardDishes.filter(dish => dish.isAvailable).length;
    
    // Category distribution
    const categoryCount = cardDishes.reduce((acc, dish) => {
      const category = DishCategoryLabels[dish.category];
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categories = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalPrice,
      averagePrice,
      availableDishes,
      categories,
      totalDishes: cardDishes.length
    };
  }, [cardDishes]);

  // Get unique categories for filter
  const uniqueCategories = useMemo(() => {
    const categories = Array.from(new Set(cardDishes.map(dish => dish.category)));
    return categories.sort();
  }, [cardDishes]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <FullScreenModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Détails de la carte "${card.name}"`}
      maxWidth="6xl"
    >
      <div className="flex flex-col h-full">
        {/* Header with Card Info */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card Basic Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{card.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Créée le {formatDate(card.dateOfCreation)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ChefHat className="w-4 h-4" />
                      <span>{stats.totalDishes} plats</span>
                    </div>
                  </div>
                </div>
                <div className={`
                  px-4 py-2 rounded-full text-sm font-medium
                  ${card.isActive 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }
                `}>
                  {card.isActive ? '✅ Carte active' : '⏸️ Carte inactive'}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Prix total</span>
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    {stats.totalPrice.toFixed(2)}€
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Prix moyen</span>
                  </div>
                  <div className="text-xl font-bold text-blue-600">
                    {stats.averagePrice.toFixed(2)}€
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-gray-600">Disponibles</span>
                  </div>
                  <div className="text-xl font-bold text-orange-600">
                    {stats.availableDishes}/{stats.totalDishes}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Tag className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Catégories</span>
                  </div>
                  <div className="text-xl font-bold text-purple-600">
                    {stats.categories.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Répartition par catégorie
              </h4>
              <div className="space-y-2">
                {stats.categories.slice(0, 5).map(({ category, count }) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 truncate">{category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(count / stats.totalDishes) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-6">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un plat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Toutes les catégories</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>
                    {DishCategoryLabels[category]}
                  </option>
                ))}
              </select>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Trier par nom</option>
                <option value="price">Trier par prix</option>
                <option value="category">Trier par catégorie</option>
              </select>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {filteredAndSortedDishes.length} plat{filteredAndSortedDishes.length > 1 ? 's' : ''}
              </span>
              <div className="flex border border-gray-300 rounded overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dishes Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {filteredAndSortedDishes.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun plat trouvé</h3>
              <p className="text-gray-600">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Cette carte ne contient aucun plat'
                }
              </p>
            </div>
          ) : (
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-4'
              }
            `}>
              <AnimatePresence>
                {filteredAndSortedDishes.map((dish) => (
                  <motion.div
                    key={dish._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`
                      bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200
                      ${viewMode === 'list' ? 'flex items-center gap-4 p-4' : 'overflow-hidden'}
                    `}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        {/* Grid View */}
                        <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <div className="text-4xl">🍽️</div>
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 flex-1 mr-2">
                              {dish.name}
                            </h4>
                            <span className="text-lg font-bold text-blue-600 whitespace-nowrap">
                              {dish.price}€
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                            {dish.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{dish.ingredients.length} ing.</span>
                            </div>
                            {dish.timeCook && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{dish.timeCook}min</span>
                              </div>
                            )}
                            <div className={`
                              px-2 py-1 rounded-full text-xs font-medium
                              ${dish.isAvailable 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                              }
                            `}>
                              {dish.isAvailable ? 'Dispo' : 'Indispo'}
                            </div>
                          </div>
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {DishCategoryLabels[dish.category]}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* List View */}
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <div className="text-2xl">🍽️</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-semibold text-gray-900 truncate">{dish.name}</h4>
                            <span className="text-lg font-bold text-blue-600 ml-4">{dish.price}€</span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-1 mb-2">{dish.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="px-2 py-1 bg-gray-100 rounded-full">
                              {DishCategoryLabels[dish.category]}
                            </span>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{dish.ingredients.length} ingrédients</span>
                            </div>
                            {dish.timeCook && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{dish.timeCook}min</span>
                              </div>
                            )}
                            <div className={`
                              px-2 py-1 rounded-full font-medium
                              ${dish.isAvailable 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                              }
                            `}>
                              {dish.isAvailable ? 'Disponible' : 'Indisponible'}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Résumé:</span> {stats.totalDishes} plats • {stats.availableDishes} disponibles • Prix total: {stats.totalPrice.toFixed(2)}€
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </FullScreenModal>
  );
};