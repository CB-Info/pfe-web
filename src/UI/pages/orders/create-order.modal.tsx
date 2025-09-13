import { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material";
import {
  ExpandMore,
  TableRestaurant,
  RestaurantMenu,
} from "@mui/icons-material";
import { Table } from "../../../data/models/table.model";
import { Dish } from "../../../data/models/dish.model";
import { Order } from "../../../data/models/order.model";
import { OrdersRepositoryImpl } from "../../../network/repositories/orders.repository";
import { CreateOrderDto, OrderStatus } from "../../../data/dto/order.dto";
import { DishCategory, DishCategoryLabels } from "../../../data/dto/dish.dto";
import { useAlerts } from "../../../hooks/useAlerts";
import Loading from "../../components/common/loading.component";

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (order: Order) => void;
  tables: Table[];
  dishes: Dish[];
}

export default function CreateOrderModal({
  isOpen,
  onClose,
  onOrderCreated,
  tables,
  dishes,
}: CreateOrderModalProps) {
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [selectedDishIds, setSelectedDishIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addAlert } = useAlerts();

  const ordersRepository = useMemo(() => new OrdersRepositoryImpl(), []);

  // Organiser les plats par catégorie
  const dishesByCategory = useMemo(() => {
    const categoryMap = new Map<DishCategory, Dish[]>();

    dishes.forEach((dish) => {
      if (!categoryMap.has(dish.category)) {
        categoryMap.set(dish.category, []);
      }
      categoryMap.get(dish.category)!.push(dish);
    });

    return Array.from(categoryMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, dishes]) => ({
        category,
        dishes: dishes.sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, [dishes]);

  // Calculer le prix total
  const totalPrice = useMemo(() => {
    return selectedDishIds.reduce((total, dishId) => {
      const dish = dishes.find((d) => d._id === dishId);
      return total + (dish?.price || 0);
    }, 0);
  }, [selectedDishIds, dishes]);

  // Tables disponibles (non occupées)
  const availableTables = tables.filter((table) => !table.isOccupied);

  const handleDishToggle = (dishId: string) => {
    setSelectedDishIds((prev) =>
      prev.includes(dishId)
        ? prev.filter((id) => id !== dishId)
        : [...prev, dishId]
    );
  };

  const handleSubmit = async () => {
    if (!selectedTableId) {
      addAlert({
        severity: "error",
        message: "Veuillez sélectionner une table",
        timeout: 5,
      });
      return;
    }

    if (selectedDishIds.length === 0) {
      addAlert({
        severity: "error",
        message: "Veuillez sélectionner au moins un plat",
        timeout: 5,
      });
      return;
    }

    try {
      setIsLoading(true);

      const orderData: CreateOrderDto = {
        tableNumberId: selectedTableId,
        dishes: selectedDishIds.map((dishId) => ({
          dishId,
          isPaid: false,
        })),
        status: OrderStatus.PENDING,
        totalPrice,
        tips: 0, // Automatiquement mis à 0 comme demandé
      };

      const newOrder = await ordersRepository.create(orderData);
      onOrderCreated(newOrder);

      // Réinitialiser le formulaire
      setSelectedTableId("");
      setSelectedDishIds([]);
    } catch (error) {
      addAlert({
        severity: "error",
        message: "Erreur lors de la création de la commande",
        timeout: 5,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setSelectedTableId("");
      setSelectedDishIds([]);
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: { minHeight: "600px" },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <RestaurantMenu color="primary" />
          Prendre une nouvelle commande
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Sélection de table */}
          <FormControl fullWidth>
            <InputLabel>Sélectionner une table</InputLabel>
            <Select
              value={selectedTableId}
              onChange={(e) => setSelectedTableId(e.target.value)}
              label="Sélectionner une table"
              disabled={isLoading}
            >
              {availableTables.length === 0 ? (
                <MenuItem disabled>Aucune table disponible</MenuItem>
              ) : (
                availableTables.map((table) => (
                  <MenuItem key={table._id} value={table._id}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <TableRestaurant fontSize="small" />
                      Table {table.number}
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {/* Sélection des plats */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Sélectionner les plats
            </Typography>

            {dishesByCategory.length === 0 ? (
              <Typography color="text.secondary">
                Aucun plat disponible
              </Typography>
            ) : (
              dishesByCategory.map(({ category, dishes: categoryDishes }) => (
                <Accordion key={category}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1">
                      {DishCategoryLabels[category]} ({categoryDishes.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={1}>
                      {categoryDishes.map((dish) => (
                        <Grid item xs={12} sm={6} key={dish._id}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectedDishIds.includes(dish._id)}
                                onChange={() => handleDishToggle(dish._id)}
                                disabled={isLoading || !dish.isAvailable}
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {dish.name} - {dish.price.toFixed(2)} €
                                </Typography>
                                {!dish.isAvailable && (
                                  <Chip
                                    label="Indisponible"
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                  />
                                )}
                                {dish.description && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                  >
                                    {dish.description}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))
            )}
          </Box>

          {/* Récapitulatif */}
          {selectedDishIds.length > 0 && (
            <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Récapitulatif de la commande
              </Typography>
              <Typography variant="body2" gutterBottom>
                {selectedDishIds.length} plat(s) sélectionné(s)
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                {selectedDishIds.map((dishId) => {
                  const dish = dishes.find((d) => d._id === dishId);
                  return dish ? (
                    <Chip
                      key={dishId}
                      label={`${dish.name} (${dish.price.toFixed(2)}€)`}
                      size="small"
                      variant="outlined"
                    />
                  ) : null;
                })}
              </Box>
              <Typography variant="h6" color="primary">
                Total: {totalPrice.toFixed(2)} €
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            isLoading || !selectedTableId || selectedDishIds.length === 0
          }
          startIcon={isLoading ? <Loading size="small" /> : null}
        >
          {isLoading ? "Création..." : "Créer la commande"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
