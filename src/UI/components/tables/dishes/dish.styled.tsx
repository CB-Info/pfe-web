import { TableCell, tableCellClasses, TableContainer, TableRow } from "@mui/material";
import { styled } from '@mui/material/styles';

export const DishTableStyled = styled(TableContainer)(({ theme }) => ({
    borderRadius: '16px',
    backgroundColor: 'white',
    border: `1px solid ${theme.palette.divider}`,
    overflow: 'visible',
    maxHeight: 'none',
}));

export const DishTableRowStyled = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
    },
    '&:hover': {
        backgroundColor: theme.palette.action.selected,
        cursor: 'pointer'
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export const DishTableCellStyled = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        color: theme.palette.text.primary,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        color: theme.palette.text.primary,
    },
}));