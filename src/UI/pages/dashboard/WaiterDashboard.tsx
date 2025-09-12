import { useState, useEffect, useMemo } from "react";
import { BaseContent } from "../../components/contents/base.content";
import { PanelContent } from "../../components/contents/panel.content";
import { motion } from "framer-motion";
import { PageHeader } from "../../components/layout/page-header.component";
import { Users, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useAlerts } from "../../../hooks/useAlerts";
import { useNavigate } from "react-router-dom";
import {
  DashboardRepositoryImpl,
  type WaiterSection,
} from "../../../network/repositories/dashboard.repository";
import Loading from "../../components/common/loading.component";

// Les interfaces sont maintenant importées depuis dashboard.repository.ts

export default function WaiterDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [waiterData, setWaiterData] = useState<WaiterSection | null>(null);
  const { addAlert } = useAlerts();
  const navigate = useNavigate();

  const dashboardRepository = useMemo(() => new DashboardRepositoryImpl(), []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const dashboardData = await dashboardRepository.getDashboardData();

        // Extraire les données de la section waiter
        if (dashboardData.sections.waiter) {
          setWaiterData(dashboardData.sections.waiter);
        } else {
          addAlert({
            severity: "warning",
            message: "Données serveur non disponibles",
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

  if (!waiterData) {
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

  const { stats } = waiterData;
  // tables sera utilisé plus tard pour l'affichage des tables

  return (
    <BaseContent>
      <div className="flex flex-col h-full">
        <PageHeader
          icon={<Users className="w-6 h-6 text-blue-600" />}
          title="Espace Serveur"
          description={`Dernière mise à jour: ${new Date().toLocaleDateString(
            "fr-FR"
          )}`}
        />

        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6 space-y-8">
            {/* Métriques clés pour serveur */}
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
                          Tables assignées
                        </p>
                        <p className="text-3xl font-bold text-blue-600">
                          {stats?.tablesAssigned || 0}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Users className="w-6 h-6 text-blue-600" />
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
                          Commandes en cours
                        </p>
                        <p className="text-3xl font-bold text-orange-600">
                          {stats?.activeOrders || 0}
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
                transition={{ delay: 0.3 }}
              >
                <PanelContent>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Commandes servies
                        </p>
                        <p className="text-3xl font-bold text-green-600">
                          {stats?.completedOrders || 0}
                        </p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <CheckCircle className="w-6 h-6 text-green-600" />
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
                          En attente
                        </p>
                        <p className="text-3xl font-bold text-red-600">
                          {stats?.pendingOrders || 0}
                        </p>
                      </div>
                      <div className="p-3 bg-red-100 rounded-full">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                  </div>
                </PanelContent>
              </motion.div>
            </div>

            {/* Section des tables */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <PanelContent>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Mes Tables</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }, (_, i) => i + 1).map(
                      (tableNumber) => (
                        <div
                          key={tableNumber}
                          className={`p-4 rounded-lg border-2 text-center transition-colors duration-200 ${
                            tableNumber <= 3
                              ? "border-red-200 bg-red-50"
                              : tableNumber <= 5
                              ? "border-orange-200 bg-orange-50"
                              : "border-green-200 bg-green-50"
                          }`}
                        >
                          <div className="text-2xl font-bold mb-1">
                            Table {tableNumber}
                          </div>
                          <div
                            className={`text-sm font-medium ${
                              tableNumber <= 3
                                ? "text-red-600"
                                : tableNumber <= 5
                                ? "text-orange-600"
                                : "text-green-600"
                            }`}
                          >
                            {tableNumber <= 3
                              ? "Commande en attente"
                              : tableNumber <= 5
                              ? "En cours"
                              : "Libre"}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </PanelContent>
            </motion.div>

            {/* Actions rapides */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <PanelContent>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Actions Rapides
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => navigate("/orders")}
                      className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors duration-200"
                    >
                      <div className="text-blue-600 font-semibold">
                        Prendre une commande
                      </div>
                      <div className="text-sm text-blue-500 mt-1">
                        Nouvelle commande table
                      </div>
                    </button>
                    <button
                      onClick={() => navigate("/orders")}
                      className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors duration-200"
                    >
                      <div className="text-green-600 font-semibold">
                        Gérer les commandes
                      </div>
                      <div className="text-sm text-green-500 mt-1">
                        Voir et finaliser
                      </div>
                    </button>
                    <button
                      onClick={() => navigate("/cards")}
                      className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors duration-200"
                    >
                      <div className="text-purple-600 font-semibold">
                        Voir les menus
                      </div>
                      <div className="text-sm text-purple-500 mt-1">
                        Cartes disponibles
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
