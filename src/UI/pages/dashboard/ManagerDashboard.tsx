import { useState, useEffect, useMemo } from "react";
import { BaseContent } from "../../components/contents/base.content";
import { PanelContent } from "../../components/contents/panel.content";
import { motion } from "framer-motion";
import { PageHeader } from "../../components/layout/page-header.component";
import {
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  BarChart3,
} from "lucide-react";
import { useAlerts } from "../../../hooks/useAlerts";
import {
  DashboardRepositoryImpl,
  type ManagerSection,
} from "../../../network/repositories/dashboard.repository";
import Loading from "../../components/common/loading.component";

// Les interfaces sont maintenant importées depuis dashboard.repository.ts

export default function ManagerDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [managerData, setManagerData] = useState<ManagerSection | null>(null);
  const { addAlert } = useAlerts();

  const dashboardRepository = useMemo(() => new DashboardRepositoryImpl(), []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const dashboardData = await dashboardRepository.getDashboardData();

        // Extraire les données de la section manager
        if (dashboardData.sections.manager) {
          setManagerData(dashboardData.sections.manager);
        } else {
          addAlert({
            severity: "warning",
            message: "Données manager non disponibles",
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

  if (!managerData) {
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

  const { stats, employees: staff } = managerData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "break":
        return "text-orange-600 bg-orange-100";
      case "offline":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Actif";
      case "break":
        return "Pause";
      case "offline":
        return "Hors service";
      default:
        return "Inconnu";
    }
  };

  return (
    <BaseContent>
      <div className="flex flex-col h-full">
        <PageHeader
          icon={<BarChart3 className="w-6 h-6 text-purple-600" />}
          title="Tableau de Bord Manager"
          description={`Dernière mise à jour: ${new Date().toLocaleDateString(
            "fr-FR"
          )}`}
        />

        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6 space-y-8">
            {/* Métriques clés pour manager */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                          Personnel actif
                        </p>
                        <p className="text-3xl font-bold text-green-600">
                          {stats?.activeEmployees}/{stats?.totalEmployees}
                        </p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <Users className="w-6 h-6 text-green-600" />
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
                          CA aujourd'hui
                        </p>
                        <p className="text-3xl font-bold text-blue-600">
                          {stats?.dailyRevenue}€
                        </p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <DollarSign className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">
                        +8% vs hier
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
                        <p className="text-sm font-medium text-gray-600">
                          Commandes aujourd'hui
                        </p>
                        <p className="text-3xl font-bold text-purple-600">
                          {stats?.ordersToday}
                        </p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-full">
                        <Target className="w-6 h-6 text-purple-600" />
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
                          Temps service moyen
                        </p>
                        <p className="text-3xl font-bold text-orange-600">
                          {stats?.averageServiceTime}
                          <span className="text-lg">min</span>
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
                transition={{ delay: 0.5 }}
              >
                <PanelContent>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Satisfaction client
                        </p>
                        <p className="text-3xl font-bold text-yellow-600">
                          {stats?.customerSatisfaction}/5
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-100 rounded-full">
                        <span className="text-2xl">⭐</span>
                      </div>
                    </div>
                  </div>
                </PanelContent>
              </motion.div>
            </div>

            {/* Équipe */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <PanelContent>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Équipe en Service
                  </h3>
                  <div className="space-y-3">
                    {staff.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-gray-600">
                              {member.role}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {member.tablesAssigned && (
                            <span className="text-sm text-gray-600">
                              {member.tablesAssigned} tables
                            </span>
                          )}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              member.status
                            )}`}
                          >
                            {getStatusLabel(member.status)}
                          </span>
                        </div>
                      </div>
                    ))}
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
