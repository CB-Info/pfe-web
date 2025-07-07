import Drawer, { ContainerDrawer } from "../../components/drawer";
import TitleStyle from "../../style/title.style";
import AddDishPage from "./add.dish.page";
import { useEffect, useState, useMemo, useCallback } from "react";
import { CircularProgress } from "@mui/material";
import { Dish } from "../../../data/models/dish.model";
import { sortDishes } from "./utils/sortDishes";
import { filterDishes } from "./utils/filterDishes";
import DishesTable from "../../components/tables/dishes/dish.table";
import UpdateDishPage from "./update.dish.page";
import CustomButton, {
  TypeButton,
  WidthButton,
} from "../../components/buttons/custom.button";
import { BaseContent } from "../../components/contents/base.content";
import { DishCategory, DishCategoryLabels } from "../../../data/dto/dish.dto";
import { FiltersDropdown, DishSortOption } from "../../components/dishes/filters-dropdown.component";
import { DishesStats } from "../../components/dishes/dishes-stats.component";
import { Plus } from "lucide-react";
import { FilterSortPanel } from "./components/filter-sort-panel";
import { motion } from "framer-motion";
import { dishRepository } from "../../../network/repositories/dishes.repository";
import { useAlerts } from "../../../contexts/alerts.context";

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function DishesPage() {
  const { addAlert } = useAlerts();
  const [isLoading, setIsLoading] = useState(false);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | undefined>(undefined);
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState<boolean>(false);
  
  // Search state with debouncing
  const [searchQueryInput, setSearchQueryInput] = useState("");
  const debouncedSearchQuery = useDebounce(searchQueryInput, 300);
  
  // Filter and sort state
  const [selectedCategory, setSelectedCategory] = useState<DishCategory>("Toutes");
  const [selectedStatus, setSelectedStatus] = useState<string>("Tous");
  const [selectedSort, setSelectedSort] = useState<DishSortOption>("Date de création (Descendant)");

  const handleCategoryChange = useCallback((label: string) => {
    const entry = Object.entries(DishCategoryLabels).find(
        ([, l]) => l === label
    );
    if (entry) {
      setSelectedCategory(entry[0] as DishCategory);
    }
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQueryInput("");
    setSelectedCategory("Toutes");
    setSelectedStatus("Tous");
    setSelectedSort("Date de création (Descendant)");
  }, []);

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

  // Filter and sort dishes with memoization
  const filteredAndSortedDishes = useMemo(() => {
    const filtered = filterDishes(dishes, {
      searchQuery: debouncedSearchQuery,
      selectedCategory,
      selectedStatus,
    });
    
    return sortDishes(filtered, selectedSort);
  }, [dishes, debouncedSearchQuery, selectedCategory, selectedStatus, selectedSort]);

  // Statistics calculations
  const dishStats = useMemo(() => {
    const total = dishes.length;
    const available = dishes.filter((dish) => dish.isAvailable).length;
    const unavailable = dishes.filter((dish) => !dish.isAvailable).length;
    const categories = new Set(dishes.map((dish) => dish.category)).size;
    
    return { total, available, unavailable, categories };
  }, [dishes]);

  const handleRowClick = (dish: Dish): void => {
    setSelectedDish(dish);
    setIsUpdateDrawerOpen(true);
  };

  const handleDelete = async () => {
    await fetchDishes();
  };

  return (
    <BaseContent>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-6 border-b border-gray-200 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <TitleStyle>Gestion des plats</TitleStyle>
              <p className="text-gray-600 text-sm mt-1">
                Gérez votre menu et organisez vos plats
              </p>
            </div>
            
            <Drawer
              width={360}
              defaultChildren={
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter un plat
                </motion.button>
              }
              drawerId="add-drawer-dish"
            >
              <AddDishPage
                onClickOnConfirm={async () => {
                  setIsLoading(true);
                  await fetchDishes();
                  setIsLoading(false);
                }}
              />
            </Drawer>
          </div>

          {/* Filter and Sort Panel */}
          <FilterSortPanel
            searchQuery={searchQueryInput}
            onSearchChange={setSearchQueryInput}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
            onResetFilters={handleResetFilters}
            totalResults={dishes.length}
            filteredResults={filteredAndSortedDishes.length}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden px-6 py-4">
          <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Table Header */}
              <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Liste des plats
                  </h3>
                  <div className="text-sm text-gray-600">
                    {filteredAndSortedDishes.length} sur {dishes.length} plat{dishes.length > 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Table Content */}
              <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <CircularProgress />
                    </div>
                  ) : (
                    <DishesTable
                      dishes={filteredAndSortedDishes}
                      setSelectedDish={handleRowClick}
                      onDelete={handleDelete}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Update Dish Drawer */}
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