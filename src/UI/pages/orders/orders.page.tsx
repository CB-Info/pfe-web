import { useState, useEffect, useMemo, useCallback } from "react";
import { BaseContent } from "../../components/contents/base.content";
import { PanelContent } from "../../components/contents/panel.content";
import { motion, AnimatePresence } from "framer-motion";
import {
  RestaurantMenu,
  Add,
  TableRestaurant,
  Pending,
  CheckCircle,
  AccessTime,
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
import { OrderStatus, OrderStatusLabels } from "../../../data/dto/order.dto";
import { NotificationEvent } from "../../../types/notifications.types";
import CreateOrderModal from "./create-order.modal";
import { DetailedConfirmationModal } from "../../components/modals/detailed-confirmation.modal";
import {
  ConnectionStatus,
  NotificationPanel,
  OrderNotification,
} from "../../components/notifications";

export default function OrdersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
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
    soundVolume: 0.8, // Volume plus fort pour les serveurs
  });

  // Hook SSE pour les notifications temps réel du service
  const sseNotifications = useSSENotifications({
    target: "service",
    enabled: true,
    onEvent: useCallback(
      (event: NotificationEvent) => {
        console.log("[OrdersPage] Nouvel événement SSE:", event);

        // Ajouter à la liste des notifications live
        // Prioriser order_ready_to_serve, ignorer order_status_updated vers READY pour éviter duplication
        if (event.type === "order_ready_to_serve") {
          setLiveNotifications((prev) => [event, ...prev.slice(0, 4)]);
        } else if (
          event.type === "order_status_updated" &&
          event.payload.status === "DELIVERED" // Seulement DELIVERED, pas READY
        ) {
          setLiveNotifications((prev) => [event, ...prev.slice(0, 4)]);
        }

        // Traiter l'événement directement pour mettre à jour les commandes
        (async () => {
          try {
            switch (event.type) {
              case "order_ready_to_serve":
                // Mettre à jour la commande spécifique
                setOrders((prev) =>
                  prev.map((order) =>
                    order._id === event.payload.orderId
                      ? { ...order, status: "READY" as OrderStatus }
                      : order
                  )
                );

                // Créer une notification UI importante (priorité sur order_status_updated)
                notificationManager.createNotificationFromEvent(event);
                break;

              case "order_status_updated":
                // Mettre à jour la commande spécifique
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

                // Créer une notification SEULEMENT pour DELIVERED
                // (pas pour READY car order_ready_to_serve a la priorité)
                if (event.payload.status === "DELIVERED") {
                  notificationManager.createNotificationFromEvent(event);
                }
                break;

              case "order_created": {
                // Recharger les commandes pour inclure la nouvelle
                const newOrders = await ordersRepository.getAll();
                setOrders(newOrders);
                break;
              }
            }
          } catch (error) {
            console.error(
              "[OrdersPage] Erreur lors du traitement de l'événement SSE:",
              error
            );
          }
        })();
      },
      [ordersRepository, notificationManager]
    ),
    onConnect: useCallback(() => {
      console.log("[OrdersPage] Connexion SSE service établie");
      addAlert({
        severity: "success",
        message: "Connexion temps réel établie",
        timeout: 3,
      });
    }, [addAlert]),
    onDisconnect: useCallback(() => {
      console.log("[OrdersPage] Connexion SSE service perdue");
      addAlert({
        severity: "warning",
        message: "Connexion temps réel interrompue",
        timeout: 5,
      });
    }, [addAlert]),
    onError: useCallback(
      (error: string) => {
        console.error("[OrdersPage] Erreur SSE:", error);
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
  }, [ordersRepository, tablesRepository, dishesRepository]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "text-orange-600 bg-orange-50 border-orange-200";
      case OrderStatus.IN_PREPARATION:
        return "text-blue-600 bg-blue-50 border-blue-200";
      case OrderStatus.READY:
        return "text-green-600 bg-green-50 border-green-200";
      case OrderStatus.DELIVERED:
        return "text-purple-600 bg-purple-50 border-purple-200";
      case OrderStatus.FINISH:
        return "text-gray-600 bg-gray-50 border-gray-200";
      case OrderStatus.CANCELLED:
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Pending className="w-4 h-4" />;
      case OrderStatus.IN_PREPARATION:
        return <AccessTime className="w-4 h-4" />;
      case OrderStatus.READY:
        return <CheckCircle className="w-4 h-4" />;
      case OrderStatus.DELIVERED:
        return <CheckCircle className="w-4 h-4" />;
      case OrderStatus.FINISH:
        return <CheckCircle className="w-4 h-4" />;
      case OrderStatus.CANCELLED:
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Pending className="w-4 h-4" />;
    }
  };

  const getTableByOrder = (order: Order) => {
    return tables.find((table) => table._id === order.tableNumberId);
  };

  const getDishNameById = (dishId: string) => {
    const dish = dishes.find((d) => d._id === dishId);
    return dish ? dish.name : "Plat inconnu";
  };

  const handleOrderCreated = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setIsCreateModalOpen(false);
    addAlert({
      severity: "success",
      message: "Commande créée avec succès!",
      timeout: 5,
    });
  };

  const handleOrderUpdate = async (orderId: string, newStatus: OrderStatus) => {
    // Demander confirmation pour l'annulation
    if (newStatus === OrderStatus.CANCELLED) {
      const order = orders.find((o) => o._id === orderId);
      if (order) {
        setOrderToCancel(order);
        setIsCancelModalOpen(true);
        return;
      }
    }

    await executeOrderUpdate(orderId, newStatus);
  };

  const executeOrderUpdate = async (
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

      const messages: Record<OrderStatus, string | undefined> = {
        [OrderStatus.PENDING]: undefined,
        [OrderStatus.IN_PREPARATION]: undefined,
        [OrderStatus.READY]: undefined,
        [OrderStatus.DELIVERED]: "Commande marquée comme servie!",
        [OrderStatus.FINISH]: "Commande marquée comme payée!",
        [OrderStatus.CANCELLED]: "Commande annulée avec succès.",
      };

      addAlert({
        severity: newStatus === OrderStatus.CANCELLED ? "warning" : "success",
        message: messages[newStatus] || "Commande mise à jour avec succès!",
        timeout: 3,
      });
    } catch (error) {
      addAlert({
        severity: "error",
        message: "Erreur lors de la mise à jour de la commande",
        timeout: 5,
      });
    }
  };

  const handleConfirmCancel = async () => {
    if (orderToCancel) {
      await executeOrderUpdate(orderToCancel._id, OrderStatus.CANCELLED);
      setIsCancelModalOpen(false);
      setOrderToCancel(null);
    }
  };

  const handleCancelModalClose = () => {
    setIsCancelModalOpen(false);
    setOrderToCancel(null);
  };

  const getAvailableActions = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return [
          {
            label: "Annuler la commande",
            nextStatus: OrderStatus.CANCELLED,
            style: "bg-red-600 hover:bg-red-700",
          },
        ];
      case OrderStatus.READY:
        return [
          {
            label: "Marquer comme servi",
            nextStatus: OrderStatus.DELIVERED,
            style: "bg-blue-600 hover:bg-blue-700",
          },
        ];
      case OrderStatus.DELIVERED:
        return [
          {
            label: "Marquer comme payé",
            nextStatus: OrderStatus.FINISH,
            style: "bg-green-600 hover:bg-green-700",
          },
        ];
      default:
        return [];
    }
  };

  // Filtrer les commandes actives (exclure les commandes payées et annulées)
  const activeOrders = orders.filter(
    (order) =>
      order.status !== OrderStatus.FINISH &&
      order.status !== OrderStatus.CANCELLED
  );

  // Trier par priorité de statut pour les serveurs
  const getStatusPriority = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.READY:
        return 1; // Priorité maximale : à servir
      case OrderStatus.DELIVERED:
        return 2; // Priorité élevée : à encaisser
      case OrderStatus.PENDING:
        return 3; // Priorité moyenne : en attente
      case OrderStatus.IN_PREPARATION:
        return 4; // Priorité basse : en cours
      default:
        return 5;
    }
  };

  const sortedActiveOrders = activeOrders.sort((a, b) => {
    const priorityA = getStatusPriority(a.status);
    const priorityB = getStatusPriority(b.status);

    // Si même priorité, trier par date de création (plus récent en premier)
    if (priorityA === priorityB) {
      return (
        new Date(b.dateOfCreation).getTime() -
        new Date(a.dateOfCreation).getTime()
      );
    }

    return priorityA - priorityB;
  });

  const pendingOrders = activeOrders.filter(
    (order) => order.status === OrderStatus.PENDING
  );
  const readyAndDeliveredOrders = activeOrders.filter(
    (order) =>
      order.status === OrderStatus.READY ||
      order.status === OrderStatus.DELIVERED
  );

  if (isLoading) {
    return (
      <BaseContent>
        <div className="flex flex-1 items-center justify-center">
          <Loading size="medium" text="Chargement des commandes..." />
        </div>
      </BaseContent>
    );
  }

  return (
    <BaseContent>
      <div className="flex flex-col h-full">
        <div className="bg-white border-b border-gray-200 px-6 py-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <RestaurantMenu className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Gestion des Commandes
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Créer et suivre les commandes des tables
                </p>
              </div>
            </div>

            {/* Indicateurs de connexion et notifications dans le header */}
            <div className="flex items-center gap-4">
              <ConnectionStatus
                status={sseNotifications.status}
                target="service"
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

        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6 space-y-8">
            {/* Notifications live en overlay */}
            <AnimatePresence>
              {liveNotifications.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-2"
                >
                  {liveNotifications.map((notification, index) => (
                    <OrderNotification
                      key={`${notification.payload.orderId}-${notification.timestamp}`}
                      event={notification}
                      autoHide={true}
                      duration={10000} // 10 secondes pour les serveurs
                      onDismiss={() => {
                        setLiveNotifications((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                      className="border-2 border-green-300 shadow-lg" // Mise en évidence
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bouton création de commande */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <PanelContent>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Actions rapides</h3>
                  </div>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <Add className="w-5 h-5" />
                    Prendre une nouvelle commande
                  </button>
                </div>
              </PanelContent>
            </motion.div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <PanelContent>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Commandes en attente
                        </p>
                        <p className="text-3xl font-bold text-orange-600">
                          {pendingOrders.length}
                        </p>
                      </div>
                      <div className="p-3 bg-orange-100 rounded-full">
                        <Pending className="w-6 h-6 text-orange-600" />
                      </div>
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
                        <p className="text-sm font-medium text-gray-600">
                          À servir/encaisser
                        </p>
                        <p className="text-3xl font-bold text-blue-600">
                          {readyAndDeliveredOrders.length}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <AccessTime className="w-6 h-6 text-blue-600" />
                      </div>
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
                        <p className="text-sm font-medium text-gray-600">
                          Total aujourd'hui
                        </p>
                        <p className="text-3xl font-bold text-green-600">
                          {activeOrders.length}
                        </p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <TableRestaurant className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>
                </PanelContent>
              </motion.div>
            </div>

            {/* Liste des commandes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <PanelContent>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Commandes actives</h3>
                  </div>
                  {sortedActiveOrders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <TableRestaurant className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Aucune commande active</p>
                      <p className="text-sm">Créez votre première commande!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sortedActiveOrders.map((order) => {
                        const table = getTableByOrder(order);
                        return (
                          <div
                            key={order._id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <TableRestaurant className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold">
                                    Table {table?.number || "?"} - #
                                    {order._id.slice(-6)}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {new Date(
                                      order.dateOfCreation
                                    ).toLocaleString("fr-FR")}
                                  </p>
                                </div>
                              </div>
                              <div
                                className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {getStatusIcon(order.status)}
                                <span className="text-sm font-medium">
                                  {OrderStatusLabels[order.status]}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <h5 className="font-medium mb-2">
                                  Plats commandés:
                                </h5>
                                <ul className="space-y-1">
                                  {order.dishes.map((orderDish, index) => (
                                    <li
                                      key={index}
                                      className="text-sm text-gray-600"
                                    >
                                      • {getDishNameById(orderDish.dishId)}
                                      {orderDish.isPaid && (
                                        <span className="ml-2 text-green-600">
                                          (Payé)
                                        </span>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Total:</p>
                                <p className="text-xl font-bold text-green-600">
                                  {order.totalPrice.toFixed(2)} €
                                </p>
                                {order.tips > 0 && (
                                  <p className="text-sm text-gray-500">
                                    Pourboire: {order.tips.toFixed(2)} €
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col justify-end">
                                {getAvailableActions(order.status).map(
                                  (action, index) => (
                                    <button
                                      key={index}
                                      onClick={() =>
                                        handleOrderUpdate(
                                          order._id,
                                          action.nextStatus
                                        )
                                      }
                                      className={`px-4 py-2 ${
                                        action.style ||
                                        "bg-blue-600 hover:bg-blue-700"
                                      } text-white text-sm rounded-lg transition-colors duration-200`}
                                    >
                                      {action.label}
                                    </button>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </PanelContent>
            </motion.div>

            {/* Section des commandes terminées (repliable) */}
            {orders.filter((order) => order.status === OrderStatus.FINISH)
              .length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <PanelContent>
                  <div className="p-6">
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <h3 className="text-lg font-semibold text-gray-600">
                          Commandes terminées (
                          {
                            orders.filter(
                              (order) => order.status === OrderStatus.FINISH
                            ).length
                          }
                          )
                        </h3>
                        <div className="text-gray-400 group-open:rotate-180 transition-transform">
                          ▼
                        </div>
                      </summary>
                      <div className="mt-4 space-y-3">
                        {orders
                          .filter(
                            (order) => order.status === OrderStatus.FINISH
                          )
                          .map((order) => {
                            const table = getTableByOrder(order);
                            return (
                              <div
                                key={order._id}
                                className="border rounded-lg p-3 bg-gray-50 opacity-75"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-200 rounded-lg">
                                      <TableRestaurant className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-sm">
                                        Table {table?.number || "?"} - #
                                        {order._id.slice(-6)}
                                      </h4>
                                      <p className="text-xs text-gray-500">
                                        {new Date(
                                          order.dateOfCreation
                                        ).toLocaleString("fr-FR")}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 px-2 py-1 rounded-full border text-gray-600 bg-gray-50 border-gray-200">
                                      <CheckCircle className="w-3 h-3" />
                                      <span className="text-xs font-medium">
                                        {OrderStatusLabels[order.status]}
                                      </span>
                                    </div>
                                    <span className="text-sm font-bold text-green-600">
                                      {order.totalPrice.toFixed(2)} €
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </details>
                  </div>
                </PanelContent>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de création de commande */}
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onOrderCreated={handleOrderCreated}
        tables={tables}
        dishes={dishes}
      />

      {/* Modal de confirmation d'annulation */}
      {orderToCancel && (
        <DetailedConfirmationModal
          modalName="cancel-order-modal"
          isOpen={isCancelModalOpen}
          onClose={handleCancelModalClose}
          onConfirm={handleConfirmCancel}
          title="Annuler la commande"
          message={`Êtes-vous sûr de vouloir annuler la commande #${orderToCancel._id.slice(
            -6
          )} pour la Table ${getTableByOrder(orderToCancel)?.number || "?"} ?`}
          details={[
            {
              label: "Table",
              value: `Table ${getTableByOrder(orderToCancel)?.number || "?"}`,
            },
            { label: "Commande", value: `#${orderToCancel._id.slice(-6)}` },
            {
              label: "Plats",
              value: orderToCancel.dishes
                .map((orderDish) => getDishNameById(orderDish.dishId))
                .join(", "),
            },
            { label: "Prix total", value: `${orderToCancel.totalPrice} €` },
          ]}
          warningMessage="Cette action est irréversible et annulera définitivement la commande."
          confirmButtonText="Annuler la commande"
        />
      )}
    </BaseContent>
  );
}
