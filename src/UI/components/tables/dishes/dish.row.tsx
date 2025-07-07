import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DishTableCellStyled } from "./dish.styled";
import { DishRowProps } from "./dish.props";
import { useState } from "react";
import { ConfirmationModal } from "../../modals/confirmation.modal";
import { DishesRepositoryImpl } from "../../../../network/repositories/dishes.repository";
import { useAlerts } from "../../../../contexts/alerts.context";
import { DishCategoryLabels } from "../../../../data/dto/dish.dto";

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

export const DishRow: React.FC<DishRowProps> = ({ row, onClick, onDelete }) => {
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
      addAlert({
        severity: "error",
        message: "Une erreur est survenue lors de la suppression du plat",
        timeout: 3,
      });
    }
    setIsDeleteModalOpen(false);
  };

  const categoryColor = categoryColors[row.category] ?? defaultCategoryColor;

  return (
    <>
      {/* Dish Name with Status Indicator */}
      <DishTableCellStyled component="th" scope="row">
        <div className="flex items-center gap-3">
          <div 
            className={`w-3 h-3 rounded-full flex-shrink-0 ${
              row.isAvailable ? 'bg-green-500' : 'bg-red-500'
            }`} 
          />
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 truncate">
              {row.name}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {row.description.length > 50 
                ? `${row.description.substring(0, 50)}...` 
                : row.description
              }
            </div>
          </div>
        </div>
      </DishTableCellStyled>

      {/* Ingredients */}
      <DishTableCellStyled align="left">
        <div className="flex flex-wrap gap-1 max-w-xs">
          {row.ingredients.slice(0, 3).map((ingredient, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200"
            >
              {ingredient.ingredient.name}
            </span>
          ))}
          {row.ingredients.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200 font-medium">
              +{row.ingredients.length - 3}
            </span>
          )}
        </div>
      </DishTableCellStyled>

      {/* Status */}
      <DishTableCellStyled align="left">
        <span 
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            row.isAvailable 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}
        >
          {row.isAvailable ? 'Disponible' : 'Indisponible'}
        </span>
      </DishTableCellStyled>

      {/* Category */}
      <DishTableCellStyled align="right">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${categoryColor.bg} ${categoryColor.text}`}
        >
          {DishCategoryLabels[row.category]}
        </span>
      </DishTableCellStyled>

      {/* Price */}
      <DishTableCellStyled align="right">
        <div className="text-right">
          <span className="text-lg font-bold text-gray-900">{row.price}€</span>
        </div>
      </DishTableCellStyled>

      {/* Actions */}
      <DishTableCellStyled align="right">
        <IconButton
          size="small"
          onClick={handleMenuClick}
          aria-label="Options"
          className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
            }
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleEditClick}>
            Modifier
          </MenuItem>
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
      </DishTableCellStyled>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        modalName={deleteModalId}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="flex flex-col items-center justify-center min-h-[200px] px-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-center text-gray-900">
            Supprimer le plat
          </h3>
          <p className="text-center text-gray-600 mb-6">
            Êtes-vous sûr de vouloir supprimer <strong>"{row.name}"</strong> ?
            <br />
            <span className="text-sm text-red-600">Cette action est irréversible.</span>
          </p>
          <div className="flex gap-3 w-full justify-center">
            <button
              className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Annuler
            </button>
            <button
              className="px-6 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
              onClick={handleConfirmDelete}
            >
              Supprimer
            </button>
          </div>
        </div>
      </ConfirmationModal>
    </>
  );
};