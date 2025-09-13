import { useState, useEffect, useMemo } from "react";
import { BaseContent } from "../../components/contents/base.content";
import { PanelContent } from "../../components/contents/panel.content";
// DishCategory supprimé car non utilisé
import { useAlerts } from "../../../hooks/useAlerts";
import {
  DashboardRepositoryImpl,
  type OwnerSection,
} from "../../../network/repositories/dashboard.repository";
import Loading from "../../components/common/loading.component";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "../../components/layout/page-header.component";
import { BarChart3 } from "lucide-react";

// Les interfaces sont maintenant importées depuis dashboard.repository.ts

export default function OwnerDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [ownerData, setOwnerData] = useState<OwnerSection | null>(null);
  const { addAlert } = useAlerts();

  const dashboardRepository = useMemo(() => new DashboardRepositoryImpl(), []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        const dashboardData = await dashboardRepository.getDashboardData();

        // Extraire les données de la section owner
        if (dashboardData.sections.owner) {
          setOwnerData(dashboardData.sections.owner);
        } else {
          // Fallback si pas de section owner (ne devrait pas arriver pour OWNER/ADMIN)
          addAlert({
            severity: "warning",
            message: "Données propriétaire non disponibles",
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

  if (!ownerData) {
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

  const { stats, recentDishes } = ownerData;

  return (
    <BaseContent>
      <div className="flex flex-col h-full">
        <PageHeader
          icon={<BarChart3 className="w-6 h-6 text-green-600" />}
          title="Tableau de Bord Propriétaire"
          description={`Dernière mise à jour: ${new Date().toLocaleDateString(
            "fr-FR"
          )}`}
        />

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6 space-y-8">
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
                        <p className="text-sm font-medium text-gray-600">
                          Total des plats
                        </p>
                        <p className="text-3xl font-bold text-blue-600">
                          {stats?.totalDishes || 0}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">
                        +12% ce mois
                      </span>
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
                          Plats disponibles
                        </p>
                        <p className="text-3xl font-bold text-green-600">
                          {stats?.availableDishes || 0}
                        </p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <Star className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <span className="text-sm text-gray-600">
                        {stats?.totalDishes
                          ? Math.round(
                              (stats.availableDishes / stats.totalDishes) * 100
                            )
                          : 0}
                        % du total
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
                          Cartes actives
                        </p>
                        <p className="text-3xl font-bold text-purple-600">
                          {stats?.activeCards || 0}
                        </p>
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
                        <p className="text-sm font-medium text-gray-600">
                          Prix moyen
                        </p>
                        <p className="text-3xl font-bold text-orange-600">
                          {stats?.averagePrice
                            ? `${stats.averagePrice.toFixed(2)}€`
                            : "0€"}
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
                    <h3 className="text-lg font-semibold mb-4">
                      Répartition par catégorie
                    </h3>
                    <div className="space-y-4">
                      {stats?.categoryDistribution.map((item) => (
                        <div
                          key={item.category}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-medium text-gray-700">
                            {item.category}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${
                                    stats.totalDishes
                                      ? (item.count / stats.totalDishes) * 100
                                      : 0
                                  }%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-bold text-gray-900 w-8">
                              {item.count}
                            </span>
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
                    <h3 className="text-lg font-semibold mb-4">
                      Ingrédients populaires
                    </h3>
                    <div className="space-y-4">
                      {stats?.topIngredients.map((ingredient, index) => (
                        <div
                          key={ingredient.name}
                          className="flex items-center gap-3"
                        >
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-green-600">
                              #{index + 1}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {ingredient.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Utilisé dans {ingredient.count} plat
                              {ingredient.count > 1 ? "s" : ""}
                            </p>
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
                    <a
                      href="/dishes"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Voir tous les plats →
                    </a>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentDishes.map((dish) => (
                      <div
                        key={dish.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900 truncate">
                            {dish.name}
                          </h4>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              dish.isAvailable
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {dish.isAvailable ? "Disponible" : "Indisponible"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {dish.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-blue-600">
                            {dish.price}€
                          </span>
                          <span className="text-xs text-gray-500">
                            {dish.isAvailable ? "Disponible" : "Indisponible"}
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
