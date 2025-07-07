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
  const sortOptions: DishSortOption[] = [
    "Date de création (Descendant)",
    "Date de création (Ascendant)",
    "Nom (Ascendant)",
    "Nom (Descendant)",
    "Prix (Ascendant)",
    "Prix (Descendant)",
  ];
  const [selectedSort, setSelectedSort] = useState<DishSortOption>(
    sortOptions[0]
  );
  const { addAlert } = useAlerts();
  const dishRepository = new DishesRepositoryImpl();

  const statusOptions = ["Tous", "Actif", "Inactif"];
  const categoryOptions = ["Toutes", ...Object.values(DishCategoryLabels)];

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
            <AddDishPage
              onClickOnConfirm={async () => {
                setIsLoading(true);
                await fetchDishes();
                setIsLoading(false);
              }}
            />
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
                <h3 className="text-lg font-semibold mb-4">Filtres</h3>
                <div className="flex gap-4 flex-wrap">
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
                    Résultats ({filteredDishes.length} plat
                    {filteredDishes.length > 1 ? "s" : ""})
                  </h3>
                  <div className="w-64">
                    <TextfieldList
                      valuesToDisplay={sortOptions}
                      onClicked={setSelectedSort}
                      defaultValue={selectedSort}
                    />
                  </div>
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
