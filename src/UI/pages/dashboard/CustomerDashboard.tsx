import { useState, useEffect, useMemo } from "react";
import { BaseContent } from "../../components/contents/base.content";
import { PanelContent } from "../../components/contents/panel.content";
import { motion } from "framer-motion";
import { PageHeader } from "../../components/layout/page-header.component";
import { ShoppingCart, Clock, Star, Utensils } from "lucide-react";
import { useAlerts } from "../../../hooks/useAlerts";
import {
  DashboardRepositoryImpl,
  type CustomerSection,
} from "../../../network/repositories/dashboard.repository";
import Loading from "../../components/common/loading.component";

export default function CustomerDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [customerData, setCustomerData] = useState<CustomerSection | null>(
    null
  );
  const { addAlert } = useAlerts();

  const dashboardRepository = useMemo(() => new DashboardRepositoryImpl(), []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const dashboardData = await dashboardRepository.getDashboardData();

        // Extraire les données de la section customer
        if (dashboardData.sections.customer) {
          setCustomerData(dashboardData.sections.customer);
        } else {
          addAlert({
            severity: "warning",
            message: "Données client non disponibles",
            timeout: 5,
          });
        }
      } catch (error) {
        addAlert({
          severity: "error",
          message:
            "Erreur lors de la récupération des données du tableau de bord",
          timeout: 5,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [dashboardRepository]); // Suppression d'addAlert des dépendances pour éviter la boucle

  if (isLoading) {
    return (
      <BaseContent>
        <div className="flex flex-1 items-center justify-center">
          <Loading size="medium" text="Chargement du tableau de bord..." />
        </div>
      </BaseContent>
    );
  }

  if (!customerData) {
    return (
      <BaseContent>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center text-gray-500">
            Aucune donnée disponible pour le moment
          </div>
        </div>
      </BaseContent>
    );
  }

  const { stats, recentOrders } = customerData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "preparing":
        return "text-orange-600 bg-orange-100";
      case "served":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Terminée";
      case "preparing":
        return "En préparation";
      case "served":
        return "Servie";
      default:
        return "Inconnu";
    }
  };

  return (
    <BaseContent>
      <div className="flex flex-col h-full">
        <PageHeader
          icon={<ShoppingCart className="w-6 h-6 text-green-600" />}
          title="Mon Espace Client"
          description="Bienvenue ! Découvrez nos menus et passez vos commandes"
        />

        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6 space-y-8">
            {/* Métriques client */}
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
                        <p className="text-sm font-medium text-gray-600">
                          Mes commandes
                        </p>
                        <p className="text-3xl font-bold text-blue-600">
                          {stats?.myOrders || 0}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <ShoppingCart className="w-6 h-6 text-blue-600" />
                      </div>
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
                        <p className="text-sm font-medium text-gray-600">
                          Catégorie préférée
                        </p>
                        <p className="text-xl font-bold text-purple-600">
                          {stats?.favoriteCategory || "N/A"}
                        </p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-full">
                        <Utensils className="w-6 h-6 text-purple-600" />
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
                          Dernière commande
                        </p>
                        <p className="text-lg font-bold text-orange-600">
                          {stats?.lastOrderTime || "Jamais"}
                        </p>
                      </div>
                      <div className="p-3 bg-orange-100 rounded-full">
                        <Clock className="w-6 h-6 text-orange-600" />
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
                          Points fidélité
                        </p>
                        <p className="text-3xl font-bold text-yellow-600">
                          {stats?.loyaltyPoints || 0}
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-100 rounded-full">
                        <Star className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                  </div>
                </PanelContent>
              </motion.div>
            </div>

            {/* Commandes récentes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <PanelContent>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Mes Commandes Récentes
                  </h3>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">
                              Commande #{order.id}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusLabel(order.status)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            {order.items.join(", ")}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(order.date).toLocaleDateString("fr-FR")}
                          </div>
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          {order.total.toFixed(2)}€
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </PanelContent>
            </motion.div>

            {/* Actions rapides */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <PanelContent>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Actions Rapides
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="p-6 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors duration-200 text-left">
                      <div className="text-blue-600 font-semibold mb-2">
                        Voir les Menus
                      </div>
                      <div className="text-sm text-blue-500">
                        Découvrez nos plats et cartes du jour
                      </div>
                    </button>
                    <button className="p-6 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors duration-200 text-left">
                      <div className="text-green-600 font-semibold mb-2">
                        Commander
                      </div>
                      <div className="text-sm text-green-500">
                        Passez une nouvelle commande
                      </div>
                    </button>
                  </div>
                </div>
              </PanelContent>
            </motion.div>
          </div>
        </div>
      </div>
    </BaseContent>
  );
}
