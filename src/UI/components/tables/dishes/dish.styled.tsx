import { TableCell, tableCellClasses, TableContainer, TableRow } from "@mui/material";
import { styled } from '@mui/material/styles';

export const DishTableStyled = styled(TableContainer)(({ theme }) => ({
    borderRadius: '16px',
    backgroundColor: 'white',
    border: `1px solid ${theme.palette.divider}`,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '& .MuiTable-root': {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    '& .MuiTableBody-root': {
        flex: 1,
        overflowY: 'auto'
    }
}));

export const DishTableRowStyled = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.action.selected,
        cursor: 'pointer',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease-in-out'
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    transition: 'all 0.2s ease-in-out',
    borderRadius: '8px',
    margin: '2px 0'
}));

export const DishTableCellStyled = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        color: theme.palette.text.primary,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        color: theme.palette.text.primary,
        padding: '16px',
        borderBottom: '1px solid #f3f4f6'
    },
}));