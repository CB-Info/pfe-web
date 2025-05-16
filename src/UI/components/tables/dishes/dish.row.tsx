import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DishTableCellStyled, DishTableRowStyled } from "./dish.styled";
import { DishRowProps } from "./dish.props";
import { useState } from "react";
import { ConfirmationModal } from "../../modals/confirmation.modal";
import { DishesRepositoryImpl } from "../../../../network/repositories/dishes.repository";
import { useAlerts } from "../../../../contexts/alerts.context";
import { DishCategoryLabels } from "../../../../data/dto/dish.dto";

const categoryColors: Record<string, { bg: string; text: string }> = {
    STARTERS: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    MAIN_DISHES: { bg: 'bg-blue-100', text: 'text-blue-800' },
    FISH_SEAFOOD: { bg: 'bg-cyan-100', text: 'text-cyan-800' },
    VEGETARIAN: { bg: 'bg-green-100', text: 'text-green-800' },
    PASTA_RICE: { bg: 'bg-orange-100', text: 'text-orange-800' },
    SALADS: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
    SOUPS: { bg: 'bg-amber-100', text: 'text-amber-800' },
    SIDE_DISHES: { bg: 'bg-purple-100', text: 'text-purple-800' },
    DESSERTS: { bg: 'bg-pink-100', text: 'text-pink-800' },
    BEVERAGES: { bg: 'bg-indigo-100', text: 'text-indigo-800' }
};

const defaultCategoryColor = { bg: 'bg-gray-100', text: 'text-gray-800' };

export const DishRow: React.FC<DishRowProps> = ({ row, onClick, onDelete }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { addAlert } = useAlerts();
    const dishRepository = new DishesRepositoryImpl();

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
                message: "Le plat a été supprimé avec succès", 
                timeout: 3 
            });
            onDelete();
        } catch (error) {
            addAlert({ 
                severity: "error", 
                message: "Une erreur est survenue lors de la suppression du plat", 
                timeout: 3 
            });
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
                className='relative'
            >
                <DishTableCellStyled component="th" scope="row">
                    {row.name}
                </DishTableCellStyled>
                <DishTableCellStyled align="left">
                    {row.ingredients.map((e) => e.ingredient.name).join(", ")}
                </DishTableCellStyled>
                <DishTableCellStyled align="left">
                    <div className="flex items-center">
                        <div className={`h-2.5 w-2.5 rounded-full mr-2 ${row.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm text-gray-600">{row.isAvailable ? 'Actif' : 'Inactif'}</span>
                    </div>
                </DishTableCellStyled>
                <DishTableCellStyled align="right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColor.bg} ${categoryColor.text}`}>
                        {DishCategoryLabels[row.category]}
                    </span>
                </DishTableCellStyled>
                <DishTableCellStyled align="right">{row.price} €</DishTableCellStyled>
                <DishTableCellStyled align="right">
                    <IconButton 
                        size='small' 
                        onClick={handleMenuClick}
                    >
                        <MoreVertIcon fontSize='small' />
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
                                color: '#EF4444',
                                '&:hover': {
                                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                                },
                            }}
                        >
                            Supprimer
                        </MenuItem>
                    </Menu>
                </DishTableCellStyled>
            </DishTableRowStyled>

            <ConfirmationModal
                modalName="delete-dish-modal"
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
            >
                <div className="flex flex-col items-center justify-center min-h-[200px] px-8">
                    <h3 className="text-lg font-semibold mb-4 text-center">Confirmer la suppression</h3>
                    <p className="text-center text-gray-600 mb-8">
                        Êtes-vous sûr de vouloir supprimer ce plat ?
                        <br />
                        Cette action est irréversible.
                    </p>
                    <div className="flex gap-4 w-full justify-center">
                        <button
                            className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
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