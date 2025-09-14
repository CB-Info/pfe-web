import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Dish } from "../../../data/models/dish.model";
import { CardDto } from "../../../data/dto/card.dto";
import { Table } from "../../../data/models/table.model";
import { CreateOrderDto, OrderStatus } from "../../../data/dto/order.dto";
import { DishCategory, DishCategoryLabels } from "../../../data/dto/dish.dto";
import { AdaptiveCardsRepositoryImpl } from "../../../network/repositories/adaptive/adaptive-cards.repository";
import { AdaptiveDishesRepositoryImpl } from "../../../network/repositories/adaptive/adaptive-dishes.repository";
import { AdaptiveOrdersRepositoryImpl } from "../../../network/repositories/adaptive/adaptive-orders.repository";
import { AdaptiveTablesRepositoryImpl } from "../../../network/repositories/adaptive/adaptive-tables.repository";
import { CustomerDishCard } from "../../components/customer/customer-dish-card.component";
import {
  CustomerCart,
  CartItem,
} from "../../components/customer/customer-cart.component";
import {
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Utensils,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomerMenuPage() {
  const { tableId } = useParams<{ tableId: string }>();

  const [table, setTable] = useState<Table | null>(null);
  const [activeCard, setActiveCard] = useState<CardDto | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [cart, setCart] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<
    Set<DishCategory>
  >(new Set());

  // Repositories
  const cardsRepository = useMemo(() => new AdaptiveCardsRepositoryImpl(), []);
  const dishesRepository = useMemo(
    () => new AdaptiveDishesRepositoryImpl(),
    []
  );
  const ordersRepository = useMemo(
    () => new AdaptiveOrdersRepositoryImpl(),
    []
  );
  const tablesRepository = useMemo(
    () => new AdaptiveTablesRepositoryImpl(),
    []
  );

  // Charger les données initiales
  useEffect(() => {
    const loadData = async () => {
      if (!tableId) {
        setError("ID de table manquant");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Charger la table
        const tableData = await tablesRepository.getById(tableId);
        setTable(tableData);

        // Charger la carte active
        const cardData = await cardsRepository.getActiveCard();
        setActiveCard(cardData);

        // Charger tous les plats
        const allDishes = await dishesRepository.getAll();

        // Filtrer les plats selon la carte active (comme dans create-order.modal.tsx)
        let filteredDishes: Dish[];
        if (cardData && cardData.dishesId.length > 0) {
          // Si une carte est active, filtrer les plats selon la carte
          filteredDishes = allDishes.filter((dish) =>
            cardData.dishesId.includes(dish._id)
          );
        } else {
          // Sinon, utiliser tous les plats
          filteredDishes = allDishes;
        }

        // Filtrer seulement les plats disponibles
        const availableDishes = filteredDishes.filter(
          (dish) => dish.isAvailable
        );
        setDishes(availableDishes);

        // Ouvrir la première catégorie par défaut
        if (availableDishes.length > 0) {
          setExpandedCategories(new Set([availableDishes[0].category]));
        }
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        setError("Impossible de charger les données. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [tableId, cardsRepository, dishesRepository, tablesRepository]);

  // Organiser les plats par catégorie
  const dishesByCategory = useMemo(() => {
    const categoryMap = new Map<DishCategory, Dish[]>();

    dishes.forEach((dish) => {
      if (!categoryMap.has(dish.category)) {
        categoryMap.set(dish.category, []);
      }
      categoryMap.get(dish.category)!.push(dish);
    });

    return Array.from(categoryMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, dishes]) => ({
        category,
        dishes: dishes.sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, [dishes]);

  // Convertir le panier en items pour le composant
  const cartItems: CartItem[] = useMemo(() => {
    const items: CartItem[] = [];
    cart.forEach((quantity, dishId) => {
      if (quantity > 0) {
        const dish = dishes.find((d) => d._id === dishId);
        if (dish) {
          items.push({ dish, quantity });
        }
      }
    });
    return items.sort((a, b) => a.dish.name.localeCompare(b.dish.name));
  }, [cart, dishes]);

  const handleQuantityChange = (dishId: string, quantity: number) => {
    setCart((prev) => {
      const newCart = new Map(prev);
      if (quantity === 0) {
        newCart.delete(dishId);
      } else {
        newCart.set(dishId, quantity);
      }
      return newCart;
    });
  };

  const handleCategoryToggle = (category: DishCategory) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleOrderSubmit = async () => {
    if (cartItems.length === 0 || !table) return;

    try {
      setIsSubmitting(true);

      const totalPrice = cartItems.reduce(
        (total, item) => total + item.dish.price * item.quantity,
        0
      );

      const orderData: CreateOrderDto = {
        tableNumberId: table._id,
        dishes: cartItems.map((item) => ({
          dishId: item.dish._id,
          isPaid: false,
        })),
        status: OrderStatus.PENDING,
        totalPrice,
        tips: 0,
      };

      await ordersRepository.create(orderData);

      // Succès
      setCart(new Map());
      setShowSuccess(true);

      // Pas de redirection - laisser le client sur la page de succès
    } catch (error) {
      console.error("Erreur lors de la commande:", error);
      setError("Erreur lors de l'envoi de la commande. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-3 sm:p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center max-w-md w-full"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Commande envoyée !
          </h2>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Votre commande a été transmise à l'équipe. Vous serez servi
            prochainement.
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            Merci pour votre commande. Bon appétit ! 🍽️
          </p>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 py-3">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {activeCard ? activeCard.name : "Carte du restaurant"}
              </h1>
              <p className="text-sm text-gray-500">
                {table ? `Table ${table.number}` : "Table inconnue"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 py-4">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Menu des plats */}
          <div className="order-2 lg:order-1 lg:col-span-2 space-y-3">
            {dishesByCategory.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun plat disponible
                </h3>
                <p className="text-gray-500">
                  Aucun plat n'est actuellement disponible à la commande.
                </p>
              </div>
            ) : (
              dishesByCategory.map(({ category, dishes: categoryDishes }) => (
                <div
                  key={category}
                  className="bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  <button
                    onClick={() => handleCategoryToggle(category)}
                    className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
                  >
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                      {DishCategoryLabels[category]} ({categoryDishes.length})
                    </h2>
                    {expandedCategories.has(category) ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedCategories.has(category) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-100"
                      >
                        <div className="p-3 sm:p-4 grid grid-cols-1 gap-3 sm:gap-4">
                          {categoryDishes.map((dish) => (
                            <CustomerDishCard
                              key={dish._id}
                              dish={dish}
                              quantity={cart.get(dish._id) || 0}
                              onQuantityChange={handleQuantityChange}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>

          {/* Panier */}
          <div className="order-1 lg:order-2 lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              <CustomerCart
                items={cartItems}
                onQuantityChange={handleQuantityChange}
                onOrderSubmit={handleOrderSubmit}
                isSubmitting={isSubmitting}
                tableName={table ? `Table ${table.number}` : "Table inconnue"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
