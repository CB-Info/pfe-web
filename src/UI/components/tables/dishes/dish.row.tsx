import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DishTableCellStyled, DishTableRowStyled } from "./dish.styled";
import { DishRowProps } from "./dish.props";
import { useState } from "react";
import { DetailedConfirmationModal } from "../../modals/detailed-confirmation.modal";
import { DishesRepositoryImpl } from "../../../../network/repositories/dishes.repository";
import { useAlerts } from "../../../../hooks/useAlerts";
import { DishCategoryLabels } from "../../../../data/dto/dish.dto";
import { handleApiError } from "../../../../utils/api.utils";

const categoryColors: Record<string, { bg: string; text: string }> = {
  STARTERS: { bg: "bg-yellow-100", text: "text-yellow-800" },
  MAIN_DISHES: { bg: "bg-blue-100", text: "text-blue-800" },
  FISH_SEAFOOD: { bg: "bg-cyan-100", text: "text-cyan-800" },
  VEGETARIAN: { bg: "bg-green-100", text: "text-green-800" },
  PASTA_RICE: { bg: "bg-orange-100", text: "text-orange-800" },
  SALADS: { bg: "bg-emerald-100", text: "text-emerald-800" },
  SOUPS: { bg: "bg-amber-100", text: "text-amber-800" },
  SIDE_DISHES: { bg: "bg-purple-100", text: "text-purple-800" },
  DESSERTS: { bg: "bg-pink-100", text: "text-pink-800" },
  BEVERAGES: { bg: "bg-indigo-100", text: "text-indigo-800" },
};

const defaultCategoryColor = { bg: "bg-gray-100", text: "text-gray-800" };

export const DishRow: React.FC<DishRowProps> = ({
  row,
  onClick,
  onDelete,
  canManage = true,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { addAlert } = useAlerts();
  const dishRepository = new DishesRepositoryImpl();
  const deleteModalId = `delete-dish-modal-${row._id}`;

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleEditClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
    onClick(row);
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dishRepository.delete(row._id);
      addAlert({
        severity: "success",
        message: `Le plat "${row.name}" a été supprimé avec succès`,
        timeout: 3,
      });
      onDelete();
    } catch (error) {
      handleApiError(
        error,
        addAlert,
        "Une erreur est survenue lors de la suppression du plat"
      );
    }
    setIsDeleteModalOpen(false);
  };

  const categoryColor = categoryColors[row.category] ?? defaultCategoryColor;

  return (
    <>
      <DishTableRowStyled
        key={row.name}
        hover
        onClick={() => onClick(row)}
        className="relative"
      >
        <DishTableCellStyled component="th" scope="row">
          {row.name}
        </DishTableCellStyled>
        <DishTableCellStyled align="left">
          {row.ingredients.map((e) => e.ingredient.name).join(", ")}
        </DishTableCellStyled>
        <DishTableCellStyled align="left">
          <div className="flex items-center pl-4">
            <div
              className={`h-3 w-3 rounded-full ${
                row.isAvailable ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
          </div>
        </DishTableCellStyled>
        <DishTableCellStyled align="right">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColor.bg} ${categoryColor.text}`}
          >
            {DishCategoryLabels[row.category]}
          </span>
        </DishTableCellStyled>
        <DishTableCellStyled align="right">{row.price} €</DishTableCellStyled>
        <DishTableCellStyled align="right">
          {canManage ? (
            <>
              <IconButton
                size="small"
                onClick={handleMenuClick}
                aria-label="Options"
                className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:bg-gray-200"
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleEditClick}>Modifier</MenuItem>
                <MenuItem
                  onClick={handleDeleteClick}
                  sx={{
                    color: "#EF4444",
                    "&:hover": {
                      backgroundColor: "rgba(239, 68, 68, 0.08)",
                    },
                  }}
                >
                  Supprimer
                </MenuItem>
              </Menu>
            </>
          ) : (
            <span className="text-gray-400 text-xs">Lecture seule</span>
          )}
        </DishTableCellStyled>
      </DishTableRowStyled>

      <DetailedConfirmationModal
        modalName={deleteModalId}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Supprimer le plat"
        message={`Êtes-vous sûr de vouloir supprimer le plat "${row.name}" ?`}
        details={[
          { label: "Nom", value: row.name },
          { label: "Catégorie", value: DishCategoryLabels[row.category] },
          { label: "Prix", value: `${row.price} €` },
          {
            label: "Ingrédients",
            value: row.ingredients.map((e) => e.ingredient.name).join(", "),
          },
          {
            label: "Statut",
            value: row.isAvailable ? "Disponible" : "Indisponible",
          },
        ]}
        warningMessage="Cette action est irréversible et supprimera définitivement le plat de tous les menus."
        confirmButtonText="Supprimer définitivement"
      />
    </>
  );
};
