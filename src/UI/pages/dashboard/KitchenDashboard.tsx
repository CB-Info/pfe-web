import { useState } from "react";
import { BaseContent } from "../../components/contents/base.content";
import { PanelContent } from "../../components/contents/panel.content";
import { motion } from "framer-motion";
import { PageHeader } from "../../components/layout/page-header.component";
import { ChefHat, Package, AlertTriangle, TrendingUp } from "lucide-react";

interface KitchenStats {
  ordersInPreparation: number;
  completedToday: number;
  lowStockItems: number;
  averagePreparationTime: number;
}

interface StockItem {
  name: string;
  quantity: number;
  unit: string;
  status: "low" | "medium" | "good";
  threshold: number;
}

export default function KitchenDashboard() {
  // Données statiques pour éviter les requêtes au chargement
  const [stats] = useState<KitchenStats>({
    ordersInPreparation: 7,
    completedToday: 23,
    lowStockItems: 4,
    averagePreparationTime: 18,
  });

  const [stockItems] = useState<StockItem[]>([
    {
      name: "Tomates",
      quantity: 15,
      unit: "kg",
      status: "good",
      threshold: 10,
    },
    { name: "Fromage", quantity: 5, unit: "kg", status: "low", threshold: 8 },
    { name: "Pâtes", quantity: 2, unit: "kg", status: "low", threshold: 5 },
    {
      name: "Basilic",
      quantity: 20,
      unit: "pcs",
      status: "good",
      threshold: 15,
    },
  ]);

  // useEffect commenté pour éviter les requêtes au chargement initial
  /*
  useEffect(() => {
    const fetchKitchenData = async () => {
      // Logique de chargement des données en cas de besoin
    };
    fetchKitchenData();
  }, [addAlert]);
  */

  // Pas de loading car données statiques

  const getStockColor = (status: string) => {
    switch (status) {
      case "low":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-orange-600 bg-orange-100";
      case "good":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <BaseContent>
      <div className="flex flex-col h-full">
        <PageHeader
          icon={<ChefHat className="w-6 h-6 text-orange-600" />}
          title="Espace Cuisine"
          description={`Dernière mise à jour: ${new Date().toLocaleDateString(
            "fr-FR"
          )}`}
        />

        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6 space-y-8">
            {/* Métriques clés pour cuisine */}
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
                          En préparation
                        </p>
                        <p className="text-3xl font-bold text-orange-600">
                          {stats?.ordersInPreparation || 0}
                        </p>
                      </div>
                      <div className="p-3 bg-orange-100 rounded-full">
                        <ChefHat className="w-6 h-6 text-orange-600" />
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
                          Terminées aujourd'hui
                        </p>
                        <p className="text-3xl font-bold text-green-600">
                          {stats?.completedToday || 0}
                        </p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <TrendingUp className="w-6 h-6 text-green-600" />
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
                          Stock faible
                        </p>
                        <p className="text-3xl font-bold text-red-600">
                          {stats?.lowStockItems || 0}
                        </p>
                      </div>
                      <div className="p-3 bg-red-100 rounded-full">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
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
                          Temps moyen
                        </p>
                        <p className="text-3xl font-bold text-blue-600">
                          {stats?.averagePreparationTime || 0}
                          <span className="text-lg">min</span>
                        </p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </PanelContent>
              </motion.div>
            </div>

            {/* État des stocks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <PanelContent>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    État des Stocks
                  </h3>
                  <div className="space-y-3">
                    {stockItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Package className="w-5 h-5 text-gray-500" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600">
                            {item.quantity} {item.unit}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStockColor(
                              item.status
                            )}`}
                          >
                            {item.status === "low"
                              ? "Stock faible"
                              : item.status === "medium"
                              ? "Stock moyen"
                              : "Stock OK"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </PanelContent>
            </motion.div>

            {/* Commandes en cours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <PanelContent>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Commandes en Préparation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 7 }, (_, i) => (
                      <div
                        key={i}
                        className="p-4 bg-orange-50 border border-orange-200 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold">Table {i + 1}</span>
                          <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                            {15 + i * 2} min
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>• Pizza Margherita x2</div>
                          <div>• Salade César x1</div>
                          {i % 2 === 0 && <div>• Pasta Carbonara x1</div>}
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
