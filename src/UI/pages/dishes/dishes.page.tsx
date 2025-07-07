import Drawer, { ContainerDrawer } from "../../components/drawer";
import TitleStyle from "../../style/title.style";
import AddDishPage from "./add.dish.page";
import { useEffect, useState, useMemo } from "react";
import { CircularProgress } from "@mui/material";
import { DishesRepositoryImpl } from "../../../network/repositories/dishes.repository";
import { useAlerts } from "../../../contexts/alerts.context";
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
import { motion } from "framer-motion";

export default function DishesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | undefined>(undefined);
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    DishCategory | "Toutes"
  >("Toutes");
  const [selectedStatus, setSelectedStatus] = useState<string>("Tous");
  const [selectedSort, setSelectedSort] = useState<DishSortOption>(
    "Date de création (Descendant)"
  );
  const { addAlert } = useAlerts();
  const dishRepository = new DishesRepositoryImpl();

  const handleCategoryChange = (label: string) => {
    if (label === "Toutes") {
      setSelectedCategory("Toutes");
    } else {
      const entry = Object.entries(DishCategoryLabels).find(
        ([, l]) => l === label
      );
      if (entry) {
        setSelectedCategory(entry[0] as DishCategory);
      }
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Toutes");
    setSelectedStatus("Tous");
    setSelectedSort("Date de création (Descendant)");
  };

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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center h-full">
              <div className="text-center">
                <CircularProgress size={48} />
                <p className="text-gray-600 mt-4">Chargement des plats...</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Filters and Stats */}
              <div className="flex-shrink-0 px-6 py-4 space-y-4 bg-gray-50 border-b border-gray-200">
                {/* Filters Dropdown */}
                <div className="flex justify-between items-center">
                  <FiltersDropdown
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    selectedStatus={selectedStatus}
                    onStatusChange={setSelectedStatus}
                    selectedSort={selectedSort}
                    onSortChange={setSelectedSort}
                    onResetFilters={handleResetFilters}
                    resultsCount={filteredDishes.length}
                  />
                </div>

                {/* Stats */}
                <DishesStats dishes={dishes} filteredCount={filteredDishes.length} />
              </div>

              {/* Table Container */}
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
                          {filteredDishes.length} sur {dishes.length} plat{dishes.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    {/* Table Content */}
                    <div className="flex-1 overflow-hidden">
                      <div className="h-full overflow-y-auto">
                        <DishesTable
                          dishes={sortedDishes}
                          setSelectedDish={handleRowClick}
                          onDelete={handleDelete}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
