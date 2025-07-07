import React, { useState, useEffect } from 'react';
import { FullScreenModal } from '../../modals/full-screen-modal';
import { CardDto } from '../../../../data/dto/card.dto';
import { Dish } from '../../../../data/models/dish.model';
import { DishesRepositoryImpl } from '../../../../network/repositories/dishes.repository';
import { useAlerts } from '../../../../contexts/alerts.context';
import { CustomerDishCard } from './customer-dish-card.component';
import { CustomerDishDetail } from './customer-dish-detail.component';
import { DishCategory, DishCategoryLabels } from '../../../../data/dto/dish.dto';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, 
  Search, 
  Filter, 
  ShoppingCart, 
  Star,
  Clock,
  Users,
  ChefHat,
  ArrowLeft,
  Smartphone,
  Monitor
} from 'lucide-react';

interface CustomerViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: CardDto;
}

type ViewMode = 'mobile' | 'desktop';

export const CustomerViewModal: React.FC<CustomerViewModalProps> = ({
  isOpen,
  onClose,
  card
}) => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DishCategory | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<ViewMode>('mobile');
  const [cart, setCart] = useState<{dish: Dish, quantity: number}[]>([]);
  
  const { addAlert } = useAlerts();
  const dishesRepository = new DishesRepositoryImpl();

  useEffect(() => {
    const fetchCardDishes = async () => {
      if (!isOpen) return;
      
      try {
        setIsLoading(true);
        const allDishes = await dishesRepository.getAll();
        const cardDishes = allDishes.filter(dish => 
          card.dishesId.includes(dish._id) && dish.isAvailable
        );
        setDishes(cardDishes);
      } catch (error) {
        addAlert({
          severity: 'error',
          message: "Erreur lors de la récupération des plats",
          timeout: 5
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCardDishes();
  }, [isOpen, card.dishesId]);

  // Get unique categories from card dishes
  const categories = Array.from(new Set(dishes.map(dish => dish.category))).sort();

  // Filter dishes
  const filteredDishes = dishes.filter(dish => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!dish.name.toLowerCase().includes(query) && 
          !dish.description.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    if (selectedCategory !== 'ALL' && dish.category !== selectedCategory) {
      return false;
    }
    
    return true;
  });

  // Group dishes by category
  const dishesByCategory = categories.reduce((acc, category) => {
    acc[category] = filteredDishes.filter(dish => dish.category === category);
    return acc;
  }, {} as Record<DishCategory, Dish[]>);

  const handleDishSelect = (dish: Dish) => {
    setSelectedDish(dish);
  };

  const handleBackToMenu = () => {
    setSelectedDish(null);
  };

  const handleAddToCart = (dish: Dish) => {
    const existingItem = cart.find(item => item.dish._id === dish._id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.dish._id === dish._id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { dish, quantity: 1 }]);
    }
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + (item.dish.price * item.quantity), 0);

  const containerClass = viewMode === 'mobile' 
    ? 'max-w-sm mx-auto' 
    : 'max-w-4xl mx-auto';

  return (
    <FullScreenModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Aperçu client - ${card.name}`}
      maxWidth="full"
    >
      <div className="bg-gray-100 min-h-full">
        {/* Preview Controls */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Aperçu client</span>
              </div>
              <div className="text-sm text-gray-600">
                Carte: <span className="font-medium">{card.name}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Vue:</span>
              <div className="flex border border-gray-300 rounded overflow-hidden">
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`flex items-center gap-2 px-3 py-1 text-sm ${
                    viewMode === 'mobile' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  Mobile
                </button>
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`flex items-center gap-2 px-3 py-1 text-sm ${
                    viewMode === 'desktop' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  Desktop
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Interface */}
        <div className={`${containerClass} bg-white min-h-screen shadow-xl`}>
          {selectedDish ? (
            <CustomerDishDetail
              dish={selectedDish}
              onBack={handleBackToMenu}
              onAddToCart={handleAddToCart}
              viewMode={viewMode}
            />
          ) : (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-1">{card.name}</h1>
                    <p className="text-blue-100 text-sm">
                      {dishes.length} plats disponibles
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-blue-100 text-sm mb-1">
                      <Star className="w-4 h-4" />
                      <span>4.8 (124 avis)</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-100 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>15-30 min</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un plat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <button
                    onClick={() => setSelectedCategory('ALL')}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                      selectedCategory === 'ALL'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-600 border border-gray-300'
                    }`}
                  >
                    <Filter className="w-3 h-3" />
                    Tous
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                        selectedCategory === category
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-600 border border-gray-300'
                      }`}
                    >
                      {DishCategoryLabels[category]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Menu Content */}
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-600">Chargement du menu...</p>
                  </div>
                ) : selectedCategory === 'ALL' ? (
                  // Show all categories
                  <div className="space-y-6">
                    {categories.map(category => {
                      const categoryDishes = dishesByCategory[category];
                      if (categoryDishes.length === 0) return null;

                      return (
                        <div key={category} className="px-4">
                          <div className="flex items-center gap-3 mb-4 pt-4">
                            <ChefHat className="w-5 h-5 text-blue-600" />
                            <h2 className="text-lg font-semibold text-gray-900">
                              {DishCategoryLabels[category]}
                            </h2>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              {categoryDishes.length}
                            </span>
                          </div>
                          <div className="grid gap-3">
                            {categoryDishes.map(dish => (
                              <CustomerDishCard
                                key={dish._id}
                                dish={dish}
                                onClick={() => handleDishSelect(dish)}
                                onAddToCart={() => handleAddToCart(dish)}
                                viewMode={viewMode}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // Show specific category
                  <div className="px-4 py-6">
                    <div className="flex items-center gap-3 mb-6">
                      <ChefHat className="w-6 h-6 text-blue-600" />
                      <h2 className="text-xl font-semibold text-gray-900">
                        {DishCategoryLabels[selectedCategory]}
                      </h2>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {filteredDishes.length} plats
                      </span>
                    </div>
                    <div className="grid gap-4">
                      {filteredDishes.map(dish => (
                        <CustomerDishCard
                          key={dish._id}
                          dish={dish}
                          onClick={() => handleDishSelect(dish)}
                          onAddToCart={() => handleAddToCart(dish)}
                          viewMode={viewMode}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!isLoading && filteredDishes.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucun plat trouvé
                    </h3>
                    <p className="text-gray-600">
                      Essayez de modifier votre recherche
                    </p>
                  </div>
                )}
              </div>

              {/* Cart Summary (Fixed Bottom) */}
              <AnimatePresence>
                {totalCartItems > 0 && (
                  <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="bg-white border-t border-gray-200 p-4 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <ShoppingCart className="w-6 h-6 text-blue-600" />
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {totalCartItems}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {totalCartItems} article{totalCartItems > 1 ? 's' : ''}
                          </p>
                          <p className="text-sm text-gray-600">
                            Total: {totalCartPrice.toFixed(2)}€
                          </p>
                        </div>
                      </div>
                      <button
                        disabled
                        className="bg-gray-400 text-white px-6 py-3 rounded-lg font-medium cursor-not-allowed"
                      >
                        Commander (Démo)
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </FullScreenModal>
  );
};