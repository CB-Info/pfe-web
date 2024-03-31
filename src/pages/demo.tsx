import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React from 'react';
import { Dish } from '../models/dish.model';
import UpdateDishPage from './update.dish.page';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '16px',
  backgroundColor: 'white',
  border: `1px solid ${theme.palette.divider}`,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // Retirez le backgroundColor pour enlever le fond noir
    // backgroundColor: theme.palette.common.black, // Cette ligne est supprimée
    color: theme.palette.text.primary, // Utilisation de la couleur de texte primaire du thème pour les en-têtes
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    // Assurez-vous que la couleur du texte est également noire pour le corps du tableau
    color: theme.palette.text.primary, // Utilisation de la couleur de texte primaire du thème pour le corps du tableau
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
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

interface RowContentProps {
  row: Dish
  onClick: (dish: Dish) => void
}

const RowContent: React.FC<RowContentProps> = ({ row, onClick }) => {
  return (
    <StyledTableRow
      key={row.name}
      hover
      onClick={() => onClick(row)}
      className='relative'
    >
      <StyledTableCell component="th" scope="row">
        {row.name}
      </StyledTableCell>
      <StyledTableCell align="left">{row.ingredients.map((e) => e.ingredient.name).join(", ")}</StyledTableCell>
      <StyledTableCell align="left">{row.price}</StyledTableCell>
      <StyledTableCell align="right">{row.category}</StyledTableCell>
      <StyledTableCell align="right">{row.price} €</StyledTableCell>
      <StyledTableCell align="right">
        <IconButton size='small' onClick={() => {}}>
          <MoreVertIcon fontSize='small'/>
        </IconButton>
        </StyledTableCell>
    </StyledTableRow>
  );
};

interface CustomizedTablesProps {
  dishes: Dish[]
  setSelectedDish: (dish: Dish) => void
}

const CustomizedTables: React.FC<CustomizedTablesProps> = ({ dishes, setSelectedDish }) => {
  return (
    <Paper elevation={0} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
      <StyledTableContainer>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Nom</StyledTableCell>
              <StyledTableCell align="left">Ingrédients</StyledTableCell>
              <StyledTableCell align="left">Status</StyledTableCell>
              <StyledTableCell align="right">Catégorie</StyledTableCell>
              <StyledTableCell align="right">Prix</StyledTableCell>
              <StyledTableCell align="right"/>
            </TableRow>
          </TableHead>
          <TableBody>
            {dishes.map((dish) => (
              <RowContent key={dish._id} row={dish} onClick={setSelectedDish}/>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Paper>
  );
}

export default CustomizedTables