import { useEffect, useState } from 'react';
import { BaseContent } from '../../components/contents/base.content';
import { PanelContent } from '../../components/contents/panel.content';
import { useAlerts } from '../../../hooks/useAlerts';
import { CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/layout/page-header.component';
import { Package } from 'lucide-react';

export default function StockPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { addAlert } = useAlerts();

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setIsLoading(true);
        // Simulation du chargement des données
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // TODO: Implémenter la récupération des données de stock
        // const stockData = await stockRepository.getAll();
        
      } catch (error) {
        addAlert({
          severity: 'error',
          message: "Erreur lors de la récupération des données de stock",
          timeout: 5
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockData();
  }, []);

  const handleCreateStock = () => {
    // TODO: Implémenter l'ouverture du modal/drawer d'ajout
    console.log('Ouvrir le formulaire d\'ajout d\'ingrédient');
  };

  return (
    <BaseContent>
      <div className="flex flex-col h-full">
        <PageHeader
          icon={<Package className="w-6 h-6 text-green-600" />}
          title="Gestion du stock"
          description="Consultez et gérez vos ingrédients en temps réel"
          showCreateButton={true}
          onCreateClick={handleCreateStock}
          createButtonLabel="Ajouter un ingrédient"
        />

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center h-full">
              <div className="text-center">
                <CircularProgress className="mb-4" />
                <p className="text-gray-600">Chargement du stock...</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Filters Bar - À implémenter */}
              <div className="bg-white border-b border-gray-200 px-6 py-4 relative z-30">
                <div className="flex flex-row items-center gap-3">
                  <div className="flex-1 min-w-0">
                    {/* TODO: Ajouter SearchInput */}
                    <div className="h-10 bg-gray-100 rounded-lg flex items-center px-3 text-gray-500">
                      Barre de recherche (à implémenter)
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* TODO: Ajouter boutons de filtres */}
                    <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-500 text-sm">
                      Filtres (à implémenter)
                    </div>
                  </div>
                </div>
              </div>

              {/* Stock Content */}
              <div className="flex-1 bg-gray-50 relative z-10">
                <div className="p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <PanelContent>
                      <div className="flex flex-col">
                        {/* Table Header */}
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">
                              Inventaire des ingrédients
                            </h3>
                          </div>
                        </div>

                        {/* Table Content - Placeholder */}
                        <div className="p-8">
                          <div className="text-center">
                            <div className="text-6xl mb-4">📦</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              Gestion du stock
                            </h3>
                            <p className="text-gray-600 mb-4">
                              La fonctionnalité de gestion du stock sera bientôt disponible.
                            </p>
                            <div className="space-y-2 text-sm text-gray-500">
                              <p>• Affichage des ingrédients en stock</p>
                              <p>• Recherche et filtres avancés</p>
                              <p>• Indicateurs de stock faible</p>
                              <p>• Actions rapides (ajouter, modifier, supprimer)</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </PanelContent>
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseContent>
  );
}