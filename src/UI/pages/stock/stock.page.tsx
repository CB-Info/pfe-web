import { useState, useEffect } from 'react';
import { BaseContent } from '../../components/contents/base.content';
import { PanelContent } from '../../components/contents/panel.content';
import { PageHeader } from '../../components/layout/page-header.component';
import { CircularProgress } from '@mui/material';
import { Package } from 'lucide-react';
import { useAlerts } from '../../../hooks/useAlerts';

export default function StockPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { addAlert } = useAlerts();

  // Simulate data loading
  useEffect(() => {
    const loadStockData = async () => {
      try {
        setIsLoading(true);
        // TODO: Fetch stock data from API
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
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

    loadStockData();
  }, []);

  const handleAddIngredient = () => {
    // TODO: Open add ingredient modal/drawer
    addAlert({
      severity: 'info',
      message: "Fonctionnalité d'ajout d'ingrédient à venir",
      timeout: 3
    });
  };

  return (
    <BaseContent>
      <div className="flex flex-col h-full">
        <PageHeader
          icon={<Package className="w-6 h-6 text-green-600" />}
          title="Gestion du stock"
          description="Consultez et gérez vos ingrédients en temps réel"
          showCreateButton={true}
          onCreateClick={handleAddIngredient}
          createButtonLabel="Ajouter un ingrédient"
        />

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center h-full">
              <div className="text-center py-16">
                <CircularProgress className="mb-4" />
                <p className="text-gray-600">Chargement du stock...</p>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Search and Filters Section */}
              <PanelContent>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recherche et filtres
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Section de recherche et filtres à implémenter
                  </p>
                </div>
              </PanelContent>

              {/* Stock List Section */}
              <PanelContent>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Inventaire des ingrédients
                    </h3>
                    <span className="text-sm text-gray-600">
                      0 ingrédient{/* TODO: Dynamic count */}
                    </span>
                  </div>
                  
                  {/* Empty State */}
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucun ingrédient en stock
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Commencez par ajouter votre premier ingrédient à l'inventaire
                    </p>
                    <button
                      onClick={handleAddIngredient}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Package className="w-4 h-4" />
                      Ajouter un ingrédient
                    </button>
                  </div>
                </div>
              </PanelContent>
            </div>
          )}
        </div>
      </div>
    </BaseContent>
  );
}