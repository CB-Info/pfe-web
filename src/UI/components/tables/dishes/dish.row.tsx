import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DishTableCellStyled, DishTableRowStyled } from "./dish.styled";
import { DishRowProps } from "./dish.props";
import { useState } from "react";
import { ConfirmationModal } from "../../modals/confirmation.modal";
import { DishesRepositoryImpl } from "../../../../network/repositories/dishes.repository";
import { useAlerts } from "../../../../contexts/alerts.context";

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
                    {row.isAvailable ? "Actif" : "Inactif"}
                </DishTableCellStyled>
                <DishTableCellStyled align="right">{row.category}</DishTableCellStyled>
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
                        <MenuItem onClick={handleDeleteClick} className="text-red-500">
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
                <div className="flex flex-col items-center gap-4 px-4">
                    <h3 className="text-lg font-semibold">Confirmer la suppression</h3>
                    <p className="text-center">
                        Êtes-vous sûr de vouloir supprimer ce plat ?
                        <br />
                        Cette action est irréversible.
                    </p>
                    <div className="flex gap-4 mt-4">
                        <button
                            className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            Annuler
                        </button>
                        <button
                            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
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