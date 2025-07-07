import DrawerButton, { ContainerDrawer } from "../../components/drawer";
import TitleStyle from "../../style/title.style";
import AddDishPage from "./add.dish.page";
import { useEffect, useState, useMemo, useCallback } from "react";
import { CircularProgress } from "@mui/material";
import { SearchInput } from "../../components/input/searchInput";
import TextfieldList from "../../components/input/textfield.list";
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
import { PanelContent } from "../../components/contents/panel.content";
import { useDishFilters } from "./hooks/useDishFilters";
import { RotateCcw, Filter } from "lucide-react";

export default function DishesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | undefined>(undefined);
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState<boolean>(false);
  
  // Utiliser le hook de persistance des filtres
  const {
    searchQuery,
    selectedCategory,
    selectedStatus,
    selectedSort,
    setSearchQuery,
    setSelectedCategory,
    setSelectedStatus,
    setSelectedSort,
    resetFilters,
    hasActiveFilters
  } = useDishFilters();

  const sortOptions = [
    "Date de création (Descendant)",
    "Date de création (Ascendant)",
    "Nom (Ascendant)",
    "Nom (Descendant)",
    "Prix (Ascendant)",
    "Prix (Descendant)",
  ] as const;

  const { addAlert } = useAlerts();
  const dishRepository = new DishesRepositoryImpl();

  const statusOptions = ["Tous", "Actif", "Inactif"];
  const categoryOptions = ["Toutes", ...Object.values(DishCategoryLabels)];

  const handleCategoryChange = useCallback((label: string) => {
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
  }, [setSelectedCategory]);

  const fetchDishes = useCallback(async () => {
    try {
      const allDishes = await dishRepository.getAll();
      setDishes(allDishes);
    } catch (error) {
      addAlert({
        severity: "error",
        message: "Erreur lors de la récupération des repas",
        timeout: 5
      });
    }
  }, [dishRepository, addAlert]);

  // Charger les plats au montage du composant
  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      await fetchDishes();
      setIsLoading(false);
    };

    fetch();
  }, []);

  // Appliquer les filtres quand les plats ou les filtres changent
  useEffect(() => {
    const filtered = filterDishes(dishes, {
      searchQuery,
      selectedCategory,
      selectedStatus,
    });
    setFilteredDishes(filtered);
  }, [searchQuery, selectedCategory, selectedStatus, dishes]);

  // Trier les plats filtrés
  const sortedDishes = useMemo(
    () => sortDishes(filteredDishes, selectedSort),
    [filteredDishes, selectedSort]
  );

  const handleRowClick = useCallback((dish: Dish): void => {
    setSelectedDish(dish);
    setIsUpdateDrawerOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    await fetchDishes();
  }, [fetchDishes]);

  // Callback pour la création d'un nouveau plat (maintient les filtres)
  const handleDishCreated = useCallback(async () => {
    setIsLoading(true);
    await fetchDishes();
    setIsLoading(false);
  }, [fetchDishes]);

  // Callback pour la mise à jour d'un plat (maintient les filtres)
  const handleDishUpdated = useCallback(async () => {
    setIsUpdateDrawerOpen(false);
    setIsLoading(true);
    await fetchDishes();
    setIsLoading(false);
  }, [fetchDishes]);

  return (
    <BaseContent>
      <div className="flex flex-col px-6 py-8 gap-8">
        <div className="flex justify-between items-center">
          <TitleStyle>Gestion des plats</TitleStyle>
          <DrawerButton
            width={360}
            defaultChildren={
              <CustomButton
                type={TypeButton.PRIMARY}
                onClick={() => {}}
                width={WidthButton.SMALL}
                isLoading={false}
              >
                Ajouter un plat
              </CustomButton>
            }
            drawerId={"add-drawer-dish"}
          >
            <AddDishPage onClickOnConfirm={handleDishCreated} />
          </DrawerButton>
        </div>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Filters Section */}
            <PanelContent>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Filtres</h3>
                    {hasActiveFilters && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        Actifs
                      </span>
                    )}
                  </div>
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Réinitialiser
                    </button>
                  )}
                </div>
                <div className="flex gap-4 flex-wrap items-end">
                  <div className="w-72">
                    <SearchInput
                      label={"Rechercher un plat"}
                      error={false}
                      name={"search"}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="w-64">
                    <TextfieldList
                      valuesToDisplay={categoryOptions}
                      onClicked={handleCategoryChange}
                      label={"Catégorie"}
                      defaultValue={
                        selectedCategory === "Toutes"
                          ? "Toutes"
                          : DishCategoryLabels[selectedCategory]
                      }
                    />
                  </div>
                  <div className="w-64">
                    <TextfieldList
                      valuesToDisplay={statusOptions}
                      onClicked={setSelectedStatus}
                      label={"Status"}
                      defaultValue={selectedStatus}
                    />
                  </div>
                </div>
              </div>
            </PanelContent>

            {/* Statistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <PanelContent>
                <div className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {dishes.length}
                  </div>
                  <div className="text-sm text-gray-600">Total des plats</div>
                </div>
              </PanelContent>
              <PanelContent>
                <div className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {dishes.filter((dish) => dish.isAvailable).length}
                  </div>
                  <div className="text-sm text-gray-600">Plats disponibles</div>
                </div>
              </PanelContent>
              <PanelContent>
                <div className="p-4">
                  <div className="text-2xl font-bold text-red-600">
                    {dishes.filter((dish) => !dish.isAvailable).length}
                  </div>
                  <div className="text-sm text-gray-600">
                    Plats indisponibles
                  </div>
                </div>
              </PanelContent>
              <PanelContent>
                <div className="p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {new Set(dishes.map((dish) => dish.category)).size}
                  </div>
                  <div className="text-sm text-gray-600">Catégories</div>
                </div>
              </PanelContent>
            </div>

            {/* Results Section */}
            <PanelContent>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    Résultats ({sortedDishes.length} plat
                    {sortedDishes.length > 1 ? "s" : ""})
                    {hasActiveFilters && (
                      <span className="text-sm font-normal text-gray-600 ml-2">
                        (filtré{sortedDishes.length > 1 ? "s" : ""} sur {dishes.length})
                      </span>
                    )}
                  </h3>
                  <div className="w-64">
                </div>
                <DishesTable
                  dishes={sortedDishes}
                  setSelectedDish={handleRowClick}
                  onDelete={handleDelete}
                />
              </div>
            </PanelContent>
          </div>
        )}

        {isUpdateDrawerOpen && selectedDish && (
          <UpdateDishDrawer
            dish={selectedDish}
            onClose={() => setIsUpdateDrawerOpen(false)}
            onCloseConfirm={handleDishUpdated}
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
