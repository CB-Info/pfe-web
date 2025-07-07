import { useEffect, useState, useMemo } from "react";
import { BaseContent } from "../../components/contents/base.content";
import { PanelContent } from "../../components/contents/panel.content";
import TitleStyle from "../../style/title.style";
import { SearchInput } from "../../components/input/searchInput";
import TextfieldList from "../../components/input/textfield.list";
import { DishesRepositoryImpl } from "../../../network/repositories/dishes.repository";
import { useAlerts } from "../../../contexts/alerts.context";
import { Dish } from "../../../data/models/dish.model";
import { sortDishes, DishSortOption } from "./utils/sortDishes";
import { filterDishes } from "./utils/filterDishes";
import DishesTable from "../../components/tables/dishes/dish.table";
import { DishFormDrawer } from "./components/dish-form-drawer";
import { DishFormMode } from "../../components/forms/dish/dish.form.props";
import { DishCategory, DishCategoryLabels } from "../../../data/dto/dish.dto";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Filter, 
  RotateCcw, 
  TrendingUp, 
  TrendingDown,
  ChefHat,
  Eye,
  EyeOff
} from "lucide-react";

const SORT_OPTIONS: DishSortOption[] = [
  "Date de création (Descendant)",
  "Date de création (Ascendant)",
  "Nom (Ascendant)",
  "Nom (Descendant)",
  "Prix (Ascendant)",
  "Prix (Descendant)",
];

const STATUS_OPTIONS = ["Tous", "Actif", "Inactif"];
const CATEGORY_OPTIONS = ["Toutes", ...Object.values(DishCategoryLabels)];

export default function DishesPage() {
  // State management
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [selectedDish, setSelectedDish] = useState<Dish | undefined>(undefined);
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [formMode, setFormMode] = useState<DishFormMode>(DishFormMode.CREATE);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<DishCategory | "Toutes">("Toutes");
  const [selectedStatus, setSelectedStatus] = useState<string>("Tous");
  const [selectedSort, setSelectedSort] = useState<DishSortOption>(SORT_OPTIONS[0]);
  const [showFilters, setShowFilters] = useState(false);

  const { addAlert } = useAlerts();
  const dishRepository = new DishesRepositoryImpl();

  // Fetch dishes data
  const fetchDishes = async () => {
    try {
      const allDishes = await dishRepository.getAll();
      setDishes(allDishes);
    } catch (error) {
      addAlert({
        severity: "error",
        message: "Erreur lors de la récupération des plats",
        timeout: 5
      });
    }
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchDishes();
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    const filtered = filterDishes(dishes, {
      searchQuery,
      selectedCategory,
      selectedStatus,
    });
    setFilteredDishes(filtered);
  }, [searchQuery, selectedCategory, selectedStatus, dishes]);

  // Memoized sorted dishes
  const sortedDishes = useMemo(
    () => sortDishes(filteredDishes, selectedSort),
    [filteredDishes, selectedSort]
  );

  // Statistics calculations
  const stats = useMemo(() => {
    const total = dishes.length;
    const available = dishes.filter(dish => dish.isAvailable).length;
    const unavailable = total - available;
    const categories = new Set(dishes.map(dish => dish.category)).size;
    const averagePrice = total > 0 ? dishes.reduce((sum, dish) => sum + dish.price, 0) / total : 0;
    
    return { total, available, unavailable, categories, averagePrice };
  }, [dishes]);

  // Event handlers
  const handleCategoryChange = (label: string) => {
    if (label === "Toutes") {
      setSelectedCategory("Toutes");
    } else {
      const entry = Object.entries(DishCategoryLabels).find(([, l]) => l === label);
      if (entry) {
        setSelectedCategory(entry[0] as DishCategory);
      }
    }
  };

  const handleCreateDish = () => {
    setFormMode(DishFormMode.CREATE);
    setSelectedDish(undefined);
    setIsFormDrawerOpen(true);
  };

  const handleEditDish = (dish: Dish) => {
    setFormMode(DishFormMode.UPDATE);
    setSelectedDish(dish);
    setIsFormDrawerOpen(true);
  };

  const handleFormSuccess = async () => {
    setIsFormDrawerOpen(false);
    setIsLoading(true);
    await fetchDishes();
    setIsLoading(false);
  };

  const handleDelete = async () => {
    await fetchDishes();
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Toutes");
    setSelectedStatus("Tous");
    setSelectedSort(SORT_OPTIONS[0]);
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "Toutes" || selectedStatus !== "Tous";

  return (
    <BaseContent>
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-6 border-b border-gray-200 bg-white"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <TitleStyle>Gestion des plats</TitleStyle>
              <p className="text-gray-600 text-sm mt-1">
                Gérez votre menu et organisez vos plats par catégorie
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateDish}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Nouveau plat
            </motion.button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-blue-50 rounded-lg p-4 border border-blue-100"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ChefHat className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-xs text-blue-700 font-medium">Total</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-green-50 rounded-lg p-4 border border-green-100"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.available}</div>
                  <div className="text-xs text-green-700 font-medium">Disponibles</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-red-50 rounded-lg p-4 border border-red-100"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <EyeOff className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{stats.unavailable}</div>
                  <div className="text-xs text-red-700 font-medium">Indisponibles</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-purple-50 rounded-lg p-4 border border-purple-100"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Filter className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{stats.categories}</div>
                  <div className="text-xs text-purple-700 font-medium">Catégories</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-orange-50 rounded-lg p-4 border border-orange-100"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.averagePrice.toFixed(0)}€
                  </div>
                  <div className="text-xs text-orange-700 font-medium">Prix moyen</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Filters Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="px-6 py-4 bg-gray-50 border-b border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
            >
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filtres et recherche</span>
              {hasActiveFilters && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  Actifs
                </span>
              )}
            </button>

            <div className="flex items-center gap-4">
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <RotateCcw className="w-4 h-4" />
                  Réinitialiser
                </button>
              )}
              
              <div className="text-sm text-gray-600">
                <span className="font-medium">{sortedDishes.length}</span> plat{sortedDishes.length > 1 ? 's' : ''} affiché{sortedDishes.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                  <SearchInput
                    label="Rechercher un plat"
                    error={false}
                    name="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  
                  <TextfieldList
                    valuesToDisplay={CATEGORY_OPTIONS}
                    onClicked={handleCategoryChange}
                    label="Catégorie"
                    defaultValue={
                      selectedCategory === "Toutes"
                        ? "Toutes"
                        : DishCategoryLabels[selectedCategory]
                    }
                  />
                  
                  <TextfieldList
                    valuesToDisplay={STATUS_OPTIONS}
                    onClicked={setSelectedStatus}
                    label="Statut"
                    defaultValue={selectedStatus}
                  />
                  
                  <TextfieldList
                    valuesToDisplay={SORT_OPTIONS}
                    onClicked={setSelectedSort}
                    label="Trier par"
                    defaultValue={selectedSort}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Content Section */}
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"
              />
              <p className="text-gray-600 font-medium">Chargement des plats...</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="h-full p-6"
            >
              <PanelContent>
                <div className="h-full flex flex-col">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Liste des plats
                      </h3>
                      
                      {sortedDishes.length > 0 && (
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>{stats.available} disponibles</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span>{stats.unavailable} indisponibles</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-hidden">
                    {sortedDishes.length > 0 ? (
                      <DishesTable
                        dishes={sortedDishes}
                        setSelectedDish={handleEditDish}
                        onDelete={handleDelete}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-6xl mb-4"
                        >
                          🍽️
                        </motion.div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {hasActiveFilters ? "Aucun plat trouvé" : "Aucun plat créé"}
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md">
                          {hasActiveFilters 
                            ? "Essayez de modifier vos critères de recherche ou de filtrage"
                            : "Commencez par créer votre premier plat pour construire votre menu"
                          }
                        </p>
                        
                        <div className="flex gap-3">
                          {hasActiveFilters && (
                            <button
                              onClick={resetFilters}
                              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                            >
                              <RotateCcw className="w-4 h-4" />
                              Réinitialiser les filtres
                            </button>
                          )}
                          
                          <button
                            onClick={handleCreateDish}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                          >
                            <Plus className="w-4 h-4" />
                            Créer un plat
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </PanelContent>
            </motion.div>
          )}
        </div>
      </div>

      {/* Form Drawer */}
      <DishFormDrawer
        isOpen={isFormDrawerOpen}
        onClose={() => setIsFormDrawerOpen(false)}
        mode={formMode}
        dish={selectedDish}
        onSuccess={handleFormSuccess}
      />
    </BaseContent>
  );
}