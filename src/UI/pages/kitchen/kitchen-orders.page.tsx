import { useState, useEffect, useMemo, useCallback } from "react";
import { BaseContent } from "../../components/contents/base.content";
import { motion, AnimatePresence } from "framer-motion";
import {
  Restaurant as ChefHat,
  Schedule as Clock,
  PlayArrow as Play,
  CheckCircle,
  TableRestaurant,
  Timer,
} from "@mui/icons-material";
import { useAlerts } from "../../../hooks/useAlerts";
import { useSSENotifications } from "../../../hooks/useSSENotifications";
import { useNotificationManager } from "../../../hooks/useNotificationManager";
import Loading from "../../components/common/loading.component";
import { OrdersRepositoryImpl } from "../../../network/repositories/orders.repository";
import { TablesRepositoryImpl } from "../../../network/repositories/tables.repository";
import { DishesRepositoryImpl } from "../../../network/repositories/dishes.repository";
import { Order } from "../../../data/models/order.model";
import { Table } from "../../../data/models/table.model";
import { Dish } from "../../../data/models/dish.model";
import { OrderStatus } from "../../../data/dto/order.dto";
import { NotificationEvent } from "../../../types/notifications.types";
import {
  ConnectionStatus,
  NotificationPanel,
  OrderNotification,
} from "../../components/notifications";

export default function KitchenOrdersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [liveNotifications, setLiveNotifications] = useState<
    NotificationEvent[]
  >([]);
  const { addAlert } = useAlerts();

  const ordersRepository = useMemo(() => new OrdersRepositoryImpl(), []);
  const tablesRepository = useMemo(() => new TablesRepositoryImpl(), []);
  const dishesRepository = useMemo(() => new DishesRepositoryImpl(), []);

  // Gestionnaire de notifications UI (doit être déclaré avant le hook SSE)
  const notificationManager = useNotificationManager({
    maxNotifications: 20,
    soundEnabled: true,
    soundVolume: 0.7,
  });

  // Hook SSE pour les notifications temps réel
  const sseNotifications = useSSENotifications({
    target: "kitchen",
    enabled: true,
    onEvent: useCallback(
      (event: NotificationEvent) => {
        console.log("[KitchenOrdersPage] Nouvel événement SSE:", event);

        // Ajouter à la liste des notifications live
        setLiveNotifications((prev) => [event, ...prev.slice(0, 4)]); // Garder seulement les 5 dernières

        // Traiter l'événement directement ici pour éviter la dépendance circulaire
        (async () => {
          try {
            switch (event.type) {
              case "order_created": {
                const newOrders = await ordersRepository.getAll();
                setOrders(newOrders);
                notificationManager.createNotificationFromEvent(event);
                break;
              }
              case "order_status_updated":
                setOrders((prev) =>
                  prev.map((order) =>
                    order._id === event.payload.orderId
                      ? {
                          ...order,
                          status: event.payload.status as OrderStatus,
                        }
                      : order
                  )
                );
                if (event.payload.status === "READY") {
                  notificationManager.createNotificationFromEvent(event);
                }
                break;
              case "order_ready_to_serve":
                setOrders((prev) =>
                  prev.map((order) =>
                    order._id === event.payload.orderId
                      ? { ...order, status: "READY" as OrderStatus }
                      : order
                  )
                );
                notificationManager.createNotificationFromEvent(event);
                break;
            }
          } catch (error) {
            console.error(
              "[KitchenOrdersPage] Erreur lors du traitement de l'événement SSE:",
              error
            );
          }
        })();
      },
      [ordersRepository, notificationManager]
    ),
    onConnect: useCallback(() => {
      console.log("[KitchenOrdersPage] Connexion SSE établie");
      addAlert({
        severity: "success",
        message: "Connexion temps réel établie",
        timeout: 3,
      });
    }, [addAlert]),
    onDisconnect: useCallback(() => {
      console.log("[KitchenOrdersPage] Connexion SSE perdue");
      addAlert({
        severity: "warning",
        message: "Connexion temps réel interrompue",
        timeout: 5,
      });
    }, [addAlert]),
    onError: useCallback(
      (error: string) => {
        console.error("[KitchenOrdersPage] Erreur SSE:", error);
        addAlert({
          severity: "error",
          message: `Erreur de connexion: ${error}`,
          timeout: 5,
        });
      },
      [addAlert]
    ),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Charger toutes les données en parallèle
        const [ordersData, tablesData, dishesData] = await Promise.all([
          ordersRepository.getAll(),
          tablesRepository.getAll(),
          dishesRepository.getAll(),
        ]);

        setOrders(ordersData);
        setTables(tablesData);
        setDishes(dishesData);
      } catch (error) {
        addAlert({
          severity: "error",
          message: "Erreur lors du chargement des données",
          timeout: 5,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtrer les commandes pertinentes pour la cuisine
  const kitchenOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        order.status === OrderStatus.PENDING ||
        order.status === OrderStatus.IN_PREPARATION
    );
  }, [orders]);

  // Commandes prêtes à servir (séparées)
  const readyOrders = useMemo(() => {
    return orders.filter((order) => order.status === OrderStatus.READY);
  }, [orders]);

  // Grouper les commandes par statut
  const ordersByStatus = useMemo(() => {
    const pending = kitchenOrders.filter(
      (order) => order.status === OrderStatus.PENDING
    );
    const inPreparation = kitchenOrders.filter(
      (order) => order.status === OrderStatus.IN_PREPARATION
    );

    return {
      [OrderStatus.PENDING]: pending.sort(
        (a, b) =>
          new Date(a.dateOfCreation).getTime() -
          new Date(b.dateOfCreation).getTime()
      ),
      [OrderStatus.IN_PREPARATION]: inPreparation.sort(
        (a, b) =>
          new Date(a.dateOfCreation).getTime() -
          new Date(b.dateOfCreation).getTime()
      ),
    };
  }, [kitchenOrders]);

  // Fonctions utilitaires
  const getTableByOrder = (order: Order): Table | undefined => {
    return tables.find((table) => table._id === order.tableNumberId);
  };

  const getDishNameById = (dishId: string): string => {
    const dish = dishes.find((d) => d._id === dishId);
    return dish ? dish.name : "Plat inconnu";
  };

  const getDishById = (dishId: string): Dish | undefined => {
    return dishes.find((d) => d._id === dishId);
  };

  const getOrderAge = (dateOfCreation: string): string => {
    const now = new Date();
    const created = new Date(dateOfCreation);
    const diffMinutes = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60)
    );

    if (diffMinutes < 1) return "< 1 min";
    if (diffMinutes < 60) return `${diffMinutes} min`;

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes}min`;
  };

  const getReadySince = (dateLastModified: string): string => {
    const now = new Date();
    // Parser la date du backend et ajouter 2h pour l'heure française
    const lastModified = new Date(dateLastModified);
    lastModified.setHours(lastModified.getHours() + 2);

    const diffMinutes = Math.floor(
      (now.getTime() - lastModified.getTime()) / (1000 * 60)
    );

    if (diffMinutes < 1) return "< 1 min";
    if (diffMinutes < 60) return `${diffMinutes} min`;

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes}min`;
  };

  const getEstimatedTime = (order: Order): number => {
    let totalTime = 0;
    order.dishes.forEach((orderDish) => {
      const dish = getDishById(orderDish.dishId);
      if (dish && dish.timeCook) {
        totalTime = Math.max(totalTime, dish.timeCook);
      }
    });
    return totalTime || 15; // 15 min par défaut
  };

  // Gestion des mises à jour de statut
  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      const updatedOrder = await ordersRepository.update({
        _id: orderId,
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? updatedOrder : order))
      );

      const statusMessages: Record<OrderStatus, string | undefined> = {
        [OrderStatus.PENDING]: undefined,
        [OrderStatus.IN_PREPARATION]: "Commande prise en charge !",
        [OrderStatus.READY]: "Commande prête à servir !",
        [OrderStatus.DELIVERED]: undefined,
        [OrderStatus.FINISH]: undefined,
        [OrderStatus.CANCELLED]: undefined,
      };

      addAlert({
        severity: "success",
        message: statusMessages[newStatus] || "Statut mis à jour",
        timeout: 3,
      });
    } catch (error) {
      addAlert({
        severity: "error",
        message: "Erreur lors de la mise à jour",
        timeout: 5,
      });
    }
  };

  if (isLoading) {
    return (
      <BaseContent>
        <div className="flex items-center justify-center h-96">
          <Loading />
        </div>
      </BaseContent>
    );
  }

  return (
    <BaseContent>
      <div>
        <div className="bg-white border-b border-gray-200 px-6 py-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <ChefHat />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Cuisine
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Gestion des commandes en cours
                </p>
              </div>
            </div>

            {/* Indicateurs de connexion et notifications dans le header */}
            <div className="flex items-center gap-4">
              <ConnectionStatus
                status={sseNotifications.status}
                target="kitchen"
                size="small"
              />
              <NotificationPanel
                notifications={notificationManager.notifications}
                unreadCount={notificationManager.unreadCount}
                onMarkAsRead={notificationManager.markAsRead}
                onMarkAllAsRead={notificationManager.markAllAsRead}
                onRemove={notificationManager.removeNotification}
                onClearAll={notificationManager.clearAll}
                soundEnabled={notificationManager.soundEnabled}
                onToggleSound={notificationManager.setSoundEnabled}
                soundVolume={notificationManager.soundVolume}
                onVolumeChange={notificationManager.setSoundVolume}
              />
            </div>
          </div>
        </div>
        <div className="p-6">
          {/* Notifications live en haut */}
          <AnimatePresence>
            {liveNotifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
              >
                <div className="space-y-2">
                  {liveNotifications.map((notification, index) => (
                    <OrderNotification
                      key={`${notification.payload.orderId}-${notification.timestamp}`}
                      event={notification}
                      autoHide={true}
                      duration={8000}
                      onDismiss={() => {
                        setLiveNotifications((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-orange-50 rounded-xl p-6 border border-orange-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">
                    En attente
                  </p>
                  <p className="text-2xl font-bold text-orange-700">
                    {ordersByStatus[OrderStatus.PENDING].length}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-blue-50 rounded-xl p-6 border border-blue-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">
                    En préparation
                  </p>
                  <p className="text-2xl font-bold text-blue-700">
                    {ordersByStatus[OrderStatus.IN_PREPARATION].length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <ChefHat className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-green-50 rounded-xl p-6 border border-green-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Prêtes</p>
                  <p className="text-2xl font-bold text-green-700">
                    {readyOrders.length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-50 rounded-xl p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Total actif
                  </p>
                  <p className="text-2xl font-bold text-gray-700">
                    {kitchenOrders.length + readyOrders.length}
                  </p>
                </div>
                <div className="p-3 bg-gray-100 rounded-full">
                  <TableRestaurant className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Vue Kanban des commandes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Colonne: En attente */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Nouvelles commandes
                    </h3>
                    <p className="text-sm text-gray-500">
                      {ordersByStatus[OrderStatus.PENDING].length} commande(s)
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {ordersByStatus[OrderStatus.PENDING].length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Aucune nouvelle commande</p>
                  </div>
                ) : (
                  ordersByStatus[OrderStatus.PENDING].map((order) => (
                    <OrderCard
                      key={order._id}
                      order={order}
                      table={getTableByOrder(order)}
                      getDishNameById={getDishNameById}
                      getOrderAge={getOrderAge}
                      getEstimatedTime={getEstimatedTime}
                      onStatusUpdate={handleStatusUpdate}
                      actionButton={{
                        text: "Commencer",
                        icon: <Play className="w-4 h-4" />,
                        color: "bg-blue-600 hover:bg-blue-700",
                        newStatus: OrderStatus.IN_PREPARATION,
                      }}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Colonne: En préparation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <ChefHat className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      En préparation
                    </h3>
                    <p className="text-sm text-gray-500">
                      {ordersByStatus[OrderStatus.IN_PREPARATION].length}{" "}
                      commande(s)
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {ordersByStatus[OrderStatus.IN_PREPARATION].length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ChefHat className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Aucune commande en cours</p>
                  </div>
                ) : (
                  ordersByStatus[OrderStatus.IN_PREPARATION].map((order) => (
                    <OrderCard
                      key={order._id}
                      order={order}
                      table={getTableByOrder(order)}
                      getDishNameById={getDishNameById}
                      getOrderAge={getOrderAge}
                      getEstimatedTime={getEstimatedTime}
                      onStatusUpdate={handleStatusUpdate}
                      actionButton={{
                        text: "Prêt",
                        icon: <CheckCircle className="w-4 h-4" />,
                        color: "bg-green-600 hover:bg-green-700",
                        newStatus: OrderStatus.READY,
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Section des commandes prêtes (repliable) */}
          {readyOrders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6">
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Commandes prêtes à servir
                          </h3>
                          <p className="text-sm text-gray-500">
                            {readyOrders.length} commande(s) en attente de
                            service
                          </p>
                        </div>
                      </div>
                      <div className="text-gray-400 group-open:rotate-180 transition-transform">
                        ▼
                      </div>
                    </summary>

                    <div className="mt-4 space-y-3">
                      {readyOrders
                        .sort(
                          (a, b) =>
                            new Date(a.dateOfCreation).getTime() -
                            new Date(b.dateOfCreation).getTime()
                        )
                        .map((order) => {
                          const table = getTableByOrder(order);
                          const readySince = order.dateLastModified
                            ? getReadySince(order.dateLastModified)
                            : getOrderAge(order.dateOfCreation);

                          return (
                            <div
                              key={order._id}
                              className="border rounded-lg p-4 bg-green-50 border-green-200"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="p-1.5 bg-green-200 rounded-full">
                                    <TableRestaurant className="w-4 h-4 text-green-700" />
                                  </div>
                                  <div>
                                    <span className="font-semibold text-green-900">
                                      Table {table?.number || "?"}
                                    </span>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Timer className="w-3 h-3 text-green-600" />
                                      <span className="text-sm text-green-600 font-medium">
                                        Prêt depuis {readySince}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <div className="text-sm text-green-700 mb-1">
                                    {order.dishes.length} plat
                                    {order.dishes.length > 1 ? "s" : ""}
                                  </div>
                                  <div className="space-y-1">
                                    {order.dishes
                                      .slice(0, 2)
                                      .map((orderDish, index) => (
                                        <div
                                          key={index}
                                          className="text-xs text-green-600"
                                        >
                                          • {getDishNameById(orderDish.dishId)}
                                        </div>
                                      ))}
                                    {order.dishes.length > 2 && (
                                      <div className="text-xs text-green-600">
                                        + {order.dishes.length - 2} autre(s)
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </details>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </BaseContent>
  );
}

// Composant pour une carte de commande
interface OrderCardProps {
  order: Order;
  table: Table | undefined;
  getDishNameById: (dishId: string) => string;
  getOrderAge: (dateOfCreation: string) => string;
  getEstimatedTime: (order: Order) => number;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void;
  actionButton: {
    text: string;
    icon: React.ReactNode;
    color: string;
    newStatus: OrderStatus;
  };
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  table,
  getDishNameById,
  getOrderAge,
  getEstimatedTime,
  onStatusUpdate,
  actionButton,
}) => {
  const estimatedTime = getEstimatedTime(order);
  const orderAge = getOrderAge(order.dateOfCreation);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
    >
      {/* Header avec table et temps */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gray-200 rounded-full">
            <TableRestaurant className="w-4 h-4 text-gray-600" />
          </div>
          <span className="font-semibold text-gray-900">
            Table {table?.number || "?"}
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1 text-gray-500">
            <Timer className="w-4 h-4" />
            <span>{orderAge}</span>
          </div>
          <div className="flex items-center gap-1 text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            <span className="font-medium">{estimatedTime} min</span>
          </div>
        </div>
      </div>

      {/* Liste des plats */}
      <div className="mb-4">
        <div className="space-y-1">
          {order.dishes.map((orderDish, index) => (
            <div key={index} className="text-sm text-gray-700">
              • {getDishNameById(orderDish.dishId)}
            </div>
          ))}
        </div>
      </div>

      {/* Bouton d'action */}
      <button
        onClick={() => onStatusUpdate(order._id, actionButton.newStatus)}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg font-medium transition-colors ${actionButton.color}`}
      >
        {actionButton.icon}
        {actionButton.text}
      </button>
    </motion.div>
  );
};
