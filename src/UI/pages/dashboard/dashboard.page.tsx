import { useEffect, useState } from 'react';
import { BaseContent } from '../../components/contents/base.content';
import { PanelContent } from '../../components/contents/panel.content';
import TitleStyle from '../../style/title.style';
import { DishesRepositoryImpl } from '../../../network/repositories/dishes.repository';
import { CardsRepositoryImpl } from '../../../network/repositories/cards.repository';
import { useAlerts } from '../../../contexts/alerts.context';
import { Dish } from '../../../data/models/dish.model';
import { CardDto } from '../../../data/dto/card.dto';
import { CircularProgress } from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Clock,
  ChefHat,
  Star
} from 'lucide-react';
import { DishCategoryLabels } from '../../../data/dto/dish.dto';
import { motion } from 'framer-motion';

interface DashboardStats {
  totalDishes: number;
  availableDishes: number;
  totalCards: number;
  activeCards: number;
  topIngredients: Array<{ name: string; count: number }>;
  categoryDistribution: Array<{ category: string; count: number }>;
  averagePrice: number;
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentDishes, setRecentDishes] = useState<Dish[]>([]);
  const { addAlert } = useAlerts();
  
  const dishesRepository = new DishesRepositoryImpl();
  const cardsRepository = new CardsRepositoryImpl();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch dishes and cards data
        const [dishes, cards, topIngredients] = await Promise.all([
          dishesRepository.getAll(),
          cardsRepository.getAll(),
          dishesRepository.getTopIngredients()
        ]);

        // Calculate statistics
        const availableDishes = dishes.filter(dish => dish.isAvailable).length;
        const activeCards = cards.filter(card => card.isActive).length;
        
        // Calculate average price
        const averagePrice = dishes.length > 0 
          ? dishes.reduce((sum, dish) => sum + dish.price, 0) / dishes.length 
          : 0;

        // Get category distribution
        const categoryCount = dishes.reduce((acc, dish) => {
          const categoryLabel = DishCategoryLabels[dish.category];
          acc[categoryLabel] = (acc[categoryLabel] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const categoryDistribution = Object.entries(categoryCount)
          .map(([category, count]) => ({ category, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        // Get top ingredients
        const ingredientCount = topIngredients.reduce((acc, ingredient) => {
          acc[ingredient.name] = (acc[ingredient.name] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const topIngredientsData = Object.entries(ingredientCount)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setStats({
          totalDishes: dishes.length,
          availableDishes,
          totalCards: cards.length,
          activeCards,
          topIngredients: topIngredientsData,
          categoryDistribution,
          averagePrice
        });

        // Get recent dishes (last 5)
        const sortedDishes = dishes.sort((a, b) => a.name.localeCompare(b.name));
        setRecentDishes(sortedDishes.slice(0, 5));

      } catch (error) {
        addAlert({
          severity: 'error',
          message: "Erreur lors de la récupération des données du tableau de bord",
          timeout: 5
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [dishesRepository]);

  if (isLoading) {
    return (
      <BaseContent>
        <div className="flex flex-1 items-center justify-center">
          <CircularProgress />
        </div>
      </BaseContent>
    );
  }

  return (
    <BaseContent>
      <div className='flex flex-col px-6 py-8 gap-8'>
        <div className='flex justify-between items-center'>
          <TitleStyle>Tableau de bord</TitleStyle>
          <div className="text-sm text-gray-500">
            Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <PanelContent>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total des plats</p>
                    <p className="text-3xl font-bold text-blue-600">{stats?.totalDishes || 0}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <ChefHat className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12% ce mois</span>
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
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Plats disponibles</p>
                    <p className="text-3xl font-bold text-green-600">{stats?.availableDishes || 0}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-gray-600">
                    {stats?.totalDishes ? Math.round((stats.availableDishes / stats.totalDishes) * 100) : 0}% du total
                  </span>
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
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cartes actives</p>
                    <p className="text-3xl font-bold text-purple-600">{stats?.activeCards || 0}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <ShoppingCart className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-gray-600">
                    {stats?.totalCards || 0} cartes au total
                  </span>
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
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Prix moyen</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {stats?.averagePrice ? `${stats.averagePrice.toFixed(2)}€` : '0€'}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <DollarSign className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600">-3% ce mois</span>
                </div>
              </div>
            </PanelContent>
          </motion.div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <PanelContent>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Répartition par catégorie</h3>
                <div className="space-y-4">
                  {stats?.categoryDistribution.map((item, index) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{item.category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${stats.totalDishes ? (item.count / stats.totalDishes) * 100 : 0}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-900 w-8">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PanelContent>
          </motion.div>

          {/* Top Ingredients */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <PanelContent>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Ingrédients populaires</h3>
                <div className="space-y-4">
                  {stats?.topIngredients.map((ingredient, index) => (
                    <div key={ingredient.name} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{ingredient.name}</p>
                        <p className="text-xs text-gray-500">Utilisé dans {ingredient.count} plat{ingredient.count > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PanelContent>
          </motion.div>
        </div>

        {/* Recent Dishes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <PanelContent>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Plats récents</h3>
                <a href="/dishes" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Voir tous les plats →
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentDishes.map((dish) => (
                  <div key={dish._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 truncate">{dish.name}</h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        dish.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {dish.isAvailable ? 'Disponible' : 'Indisponible'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{dish.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-600">{dish.price}€</span>
                      <span className="text-xs text-gray-500">
                        {dish.ingredients.length} ingrédient{dish.ingredients.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </PanelContent>
        </motion.div>
      </div>
    </BaseContent>
  );
}