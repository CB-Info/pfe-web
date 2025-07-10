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
  ChevronDown,
  ChevronUp,
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
  const [viewMode, setViewMode] = useState<ViewMode>('mobile');
  const [expandedCategories, setExpandedCategories] = useState<Set<DishCategory>>(new Set());
  
  const { addAlert } = useAlerts();
  const dishesRepository = new DishesRepositoryImpl();

  useEffect(() => {
    const fetchCardDishes = async () => {
      if (!isOpen) return;
      
      try {
        setIsLoading(true);
        const allDishes = await dishesRepository.getAll();
        const cardDishes = allDishes.filter(dish => 
          card.dishesId.includes(dish._id)
        );
        setDishes(cardDishes);
        
        // Expand first category by default
        if (cardDishes.length > 0) {
          const firstCategory = cardDishes[0].category;
          setExpandedCategories(new Set([firstCategory]));
        }
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

  // Get unique categories from card dishes and group dishes
  const categoriesWithDishes = React.useMemo(() => {
    const categoryMap = new Map<DishCategory, Dish[]>();
    
    dishes.forEach(dish => {
      if (!categoryMap.has(dish.category)) {
        categoryMap.set(dish.category, []);
      }
      categoryMap.get(dish.category)!.push(dish);
    });

    // Sort categories and dishes within each category
    return Array.from(categoryMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, dishes]) => ({
        category,
        dishes: dishes.sort((a, b) => a.name.localeCompare(b.name))
      }));
  }, [dishes]);

  const handleDishSelect = (dish: Dish) => {
    setSelectedDish(dish);
  };

  const handleBackToMenu = () => {
    setSelectedDish(null);
  };

  const toggleCategory = (category: DishCategory) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

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
                Carte: <span className="font-medium">{card.name}</span> • {dishes.length} plats
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
            />
          ) : (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-2">{card.name}</h1>
                  <p className="text-blue-100 text-sm">
                    Découvrez notre sélection de {dishes.length} plats
                  </p>
                </div>
              </div>

              {/* Menu Content */}
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-600">Chargement du menu...</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {categoriesWithDishes.map(({ category, dishes: categoryDishes }) => (
                      <div key={category} className="border-b border-gray-100 last:border-b-0">
                        {/* Category Header */}
                        <button
                          onClick={() => toggleCategory(category)}
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-lg">
                                {category === 'STARTERS' && '🥗'}
                                {category === 'MAIN_DISHES' && '🍖'}
                                {category === 'FISH_SEAFOOD' && '🐟'}
                                {category === 'VEGETARIAN' && '🥬'}
                                {category === 'PASTA_RICE' && '🍝'}
                                {category === 'SALADS' && '🥙'}
                                {category === 'SOUPS' && '🍲'}
                                {category === 'SIDE_DISHES' && '🍟'}
                                {category === 'DESSERTS' && '🍰'}
                                {category === 'BEVERAGES' && '🥤'}
                              </span>
                            </div>
                            <div className="text-left">
                              <h2 className="text-lg font-semibold text-gray-900">
                                {DishCategoryLabels[category]}
                              </h2>
                              <p className="text-sm text-gray-600">
                                {categoryDishes.length} plat{categoryDishes.length > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              {categoryDishes.length}
                            </span>
                            {expandedCategories.has(category) ? (
                              <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </button>

                        {/* Category Dishes */}
                        <AnimatePresence>
                          {expandedCategories.has(category) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 space-y-3">
                                {categoryDishes.map(dish => (
                                  <CustomerDishCard
                                    key={dish._id}
                                    dish={dish}
                                    onClick={() => handleDishSelect(dish)}
                                    viewMode={viewMode}
                                  />
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {!isLoading && dishes.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🍽️</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucun plat dans cette carte
                    </h3>
                    <p className="text-gray-600">
                      Ajoutez des plats à votre carte pour les voir apparaître ici
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </FullScreenModal>
  );
};