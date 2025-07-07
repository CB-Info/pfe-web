import DrawerButton, { ContainerDrawer } from "../../components/drawer";
import TitleStyle from "../../style/title.style";
import AddDishPage from "./add.dish.page";
import { useEffect, useState, useMemo } from "react";
import { CircularProgress } from "@mui/material";
import { SearchInput } from "../../components/input/searchInput";
import TextfieldList from "../../components/input/textfield.list";
import { DishesRepositoryImpl } from "../../../network/repositories/dishes.repository";
import { useAlerts } from "../../../contexts/alerts.context";
import { Dish } from "../../../data/models/dish.model";
import { sortDishes, DishSortOption } from "./utils/sortDishes";
import { filterDishes } from "./utils/filterDishes";
import DishesTable from "../../components/tables/dishes/dish.table";
import UpdateDishPage from "./update.dish.page";
import CustomButton, {
  TypeButton,
  WidthButton,
} from "../../components/buttons/custom.button";
import { BaseContent } from "../../components/contents/base.content";
import { DishCategory, DishCategoryLabels } from "../../../data/dto/dish.dto";
import { PanelContent } from "../../components/contents/panel.content";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Filter, 
  RotateCcw, 
  ChefHat,
  BarChart3
} from "lucide-react";

export default function DishesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | undefined>(undefined);
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<DishCategory | "Toutes">("Toutes");
  const [selectedStatus, setSelectedStatus] = useState<string>("Tous");
  const [showFilters, setShowFilters] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const sortOptions: DishSortOption[] = [
    "Date de création (Descendant)",
    "Date de création (Ascendant)",
    "Nom (Ascendant)",
    "Nom (Descendant)",
    "Prix (Ascendant)",
    "Prix (Descendant)",
  ];
  const [selectedSort, setSelectedSort] = useState<DishSortOption>(sortOptions[0]);
  
  const { addAlert } = useAlerts();
  const dishRepository = new DishesRepositoryImpl();

  const statusOptions = ["Tous", "Actif", "Inactif"];
  const categoryOptions = ["Toutes", ...Object.values(DishCategoryLabels)];

  const handleCategoryChange = (label: string) => {
    setOpenDropdown(null); // Close any open dropdown
    if (label === "Toutes") {
      setSelectedCategory("Toutes");
    } else {
      const entry = Object.entries(DishCategoryLabels).find(([, l]) => l === label);
      if (entry) {
        setSelectedCategory(entry[0] as DishCategory);
      }
    }
  };

  const handleStatusChange = (status: string) => {
    setOpenDropdown(null); // Close any open dropdown
    setSelectedStatus(status);
  };

  const handleSortChange = (sort: DishSortOption) => {
    setOpenDropdown(null); // Close any open dropdown
    setSelectedSort(sort);
  };

  const resetFilters = () => {
    setOpenDropdown(null); // Close any open dropdown
    setSearchQuery("");
    setSelectedCategory("Toutes");
    setSelectedStatus("Tous");
    setSelectedSort(sortOptions[0]);
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "Toutes" || selectedStatus !== "Tous";

  const fetchDishes = async () => {
    try {
      const allDishes = await dishRepository.getAll();
      setDishes(allDishes);
    } catch (error) {
      addAlert({
        severity: "error",
        message: "Erreur lors de la récupération des repas",
      });
    }
  };

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      await fetchDishes();
      setIsLoading(false);
    };

    fetch();
  }, []);

  useEffect(() => {
    setFilteredDishes(
      filterDishes(dishes, {
        searchQuery,
        selectedCategory,
        selectedStatus,
      })
    );
  }, [searchQuery, selectedCategory, selectedStatus, dishes]);

  const sortedDishes = useMemo(
    () => sortDishes(filteredDishes, selectedSort),
    [filteredDishes, selectedSort]
  );

  const handleRowClick = (dish: Dish): void => {
    setSelectedDish(dish);
    setIsUpdateDrawerOpen(true);
  };

  const handleDelete = async () => {
    await fetchDishes();
  };

  // Calculate filtered count for display
  const filteredCount = filteredDishes.length;

  return (
    <BaseContent>
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-b border-gray-200 px-6 py-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <ChefHat className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <TitleStyle className="text-2xl">Gestion des plats</TitleStyle>
                <p className="text-gray-600 text-sm mt-1">
                  Gérez votre menu et vos plats en toute simplicité
                </p>
              </div>
            </div>
            
            <DrawerButton
              width={360}
              defaultChildren={
                <CustomButton
                  type={TypeButton.PRIMARY}
                  onClick={() => {}}
                  width={WidthButton.MEDIUM}
                  isLoading={false}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau plat
                </CustomButton>
              }
              drawerId={"add-drawer-dish"}
            >
              <AddDishPage
                onClickOnConfirm={async () => {
                  setIsLoading(true);
                  await fetchDishes();
                  setIsLoading(false);
                }}
              />
            </DrawerButton>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center h-full">
              <div className="text-center">
                <CircularProgress className="mb-4" />
                <p className="text-gray-600">Chargement des plats...</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Filters Bar */}
              <div className="bg-white border-b border-gray-200 px-6 py-4 relative z-30">
                <div className="flex flex-row items-center gap-3">
                  {/* Search */}
                  <div className="flex-1 min-w-0">
                    <SearchInput
                      label=""
                      error={false}
                      name="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Filter Controls */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                        showFilters || hasActiveFilters
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Filter className="w-4 h-4" />
                      <span className="text-sm font-medium hidden sm:inline">Filtres</span>
                      {hasActiveFilters && (
                        <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                          !
                        </span>
                      )}
                    </button>

                    {hasActiveFilters && (
                      <button
                        onClick={resetFilters}
                        className="flex items-center gap-1 px-2 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span className="text-sm font-medium hidden sm:inline">Reset</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Extended Filters */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-4 pt-4 border-t border-gray-200 overflow-visible relative z-40"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                        <TextfieldList
                          valuesToDisplay={categoryOptions}
                          onClicked={handleCategoryChange}
                          label="Catégorie"
                          defaultValue={
                            selectedCategory === "Toutes"
                              ? "Toutes"
                              : DishCategoryLabels[selectedCategory]
                          }
                        />
                        
                        <TextfieldList
                          valuesToDisplay={statusOptions}
                          onClicked={handleStatusChange}
                          label="Statut"
                          defaultValue={selectedStatus}
                        />
                        
                        <TextfieldList
                          valuesToDisplay={sortOptions}
                          onClicked={handleSortChange}
                          label="Tri"
                          defaultValue={selectedSort}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Table Section */}
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
                              Liste des plats
                            </h3>
                          </div>
                        </div>

                        {/* Table Content */}
                        <div className="overflow-x-auto">
                          {filteredCount === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                              <div className="text-6xl mb-4">🔍</div>
                              <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Aucun plat trouvé
                              </h3>
                              <p className="text-gray-600 mb-4">
                                {hasActiveFilters 
                                  ? "Aucun plat ne correspond à vos critères de recherche"
                                  : "Commencez par ajouter votre premier plat"
                                }
                              </p>
                              {hasActiveFilters ? (
                                <button
                                  onClick={resetFilters}
                                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                  Réinitialiser les filtres
                                </button>
                              ) : (
                                <DrawerButton
                                  width={360}
                                  defaultChildren={
                                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                                      <Plus className="w-4 h-4" />
                                      Ajouter un plat
                                    </button>
                                  }
                                  drawerId={"add-drawer-dish-empty"}
                                >
                                  <AddDishPage
                                    onClickOnConfirm={async () => {
                                      setIsLoading(true);
                                      await fetchDishes();
                                      setIsLoading(false);
                                    }}
                                  />
                                </DrawerButton>
                              )}
                            </div>
                          ) : (
                            <DishesTable
                              dishes={sortedDishes}
                              setSelectedDish={handleRowClick}
                              onDelete={handleDelete}
                            />
                          )}
                        </div>
                      </div>
                    </PanelContent>
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Update Drawer */}
        {isUpdateDrawerOpen && selectedDish && (
          <UpdateDishDrawer
            dish={selectedDish}
            onClose={() => setIsUpdateDrawerOpen(false)}
            onCloseConfirm={async () => {
              setIsUpdateDrawerOpen(false);
              setIsLoading(true);
              await fetchDishes();
              setIsLoading(false);
            }}
          />
        )}
      </div>
    </BaseContent>
  );
}

interface UpdateDishDrawerProps {
  dish: Dish;
  onClose: () => void;
  onCloseConfirm: () => void;
}

const UpdateDishDrawer: React.FC<UpdateDishDrawerProps> = ({
  dish,
  onCloseConfirm,
  onClose,
}) => {
  return (
    <div className="drawer drawer-end">
      <input
        id="update-dish-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={true}
        onChange={() => {}}
      />
      <div className="drawer-side z-50">
        <label
          htmlFor="update-dish-drawer"
          className="drawer-overlay"
          onClick={onClose}
        ></label>
        <ContainerDrawer width={360}>
          <UpdateDishPage dish={dish} onClickOnConfirm={onCloseConfirm} />
        </ContainerDrawer>
      </div>
    </div>
  );
};