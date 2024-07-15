import { IconButton} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DishTableCellStyled, DishTableRowStyled } from "./dish.styled";
import { DishRowProps } from "./dish.props";

export const DishRow: React.FC<DishRowProps> = ({ row, onClick }) => {
    return (
        <DishTableRowStyled
            key={row.name}
            hover
            onClick={() => onClick(row)}
            className='relative'
        >
            <DishTableCellStyled component="th" scope="row">
                {row.name}
            </DishTableCellStyled>
            <DishTableCellStyled align="left">{row.ingredients.map((e) => e.ingredient.name).join(", ")}</DishTableCellStyled>
            <DishTableCellStyled align="left">{row.isAvailable == true ? "Actif" : "Inactif"}</DishTableCellStyled>
            <DishTableCellStyled align="right">{row.category}</DishTableCellStyled>
            <DishTableCellStyled align="right">{row.price} €</DishTableCellStyled>
            <DishTableCellStyled align="right">
                <IconButton size='small' onClick={() => { }}>
                    <MoreVertIcon fontSize='small' />
                </IconButton>
            </DishTableCellStyled>
        </DishTableRowStyled>
    );
};