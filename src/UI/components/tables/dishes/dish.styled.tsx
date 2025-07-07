import { TableCell, tableCellClasses, TableContainer } from "@mui/material";
import { styled } from '@mui/material/styles';

export const DishTableStyled = styled(TableContainer)(({ theme }) => ({
    borderRadius: '12px',
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
    '& .MuiTableHead-root': {
        flexShrink: 0
    },
    '& .MuiTableBody-root': {
        flex: 1,
        overflowY: 'auto'
    },
    '& .MuiTableFooter-root': {
        flexShrink: 0,
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.grey[50]
    }
}));

export const DishTableCellStyled = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        color: theme.palette.text.primary,
        fontWeight: 600,
        fontSize: '0.875rem',
        backgroundColor: theme.palette.grey[50],
        borderBottom: `2px solid ${theme.palette.divider}`,
        padding: '16px'
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: '0.875rem',
        color: theme.palette.text.primary,
        padding: '16px',
        borderBottom: `1px solid ${theme.palette.grey[200]}`,
        verticalAlign: 'top'
    },
    [`&.${tableCellClasses.footer}`]: {
        borderBottom: 'none',
        padding: '12px 16px'
    }
}));