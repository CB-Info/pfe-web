import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  TableFooter,
  TablePagination,
  useTheme,
  CircularProgress,
} from "@mui/material";
import React from "react";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { DishRow } from "./dish.row";
import { DishTableCellStyled, DishTableStyled } from "./dish.styled";
import { DishesTableProps, TablePaginationActionsProps } from "./dish.props";
import { motion, AnimatePresence } from "framer-motion";

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const DishesTable: React.FC<DishesTableProps> = ({
  dishes,
  setSelectedDish,
  onDelete,
}) => {
  const [page, setPage] = React.useState(0);
  const rowsPerPage = 10;

  const displayedDishes = dishes;

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - displayedDishes.length)
      : 0;

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const paginatedDishes = rowsPerPage > 0
    ? displayedDishes.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      )
    : displayedDishes;

  if (dishes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-gray-200">
        <div className="text-6xl mb-4">🍽️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucun plat trouvé
        </h3>
        <p className="text-gray-600 text-center">
          Aucun plat ne correspond à vos critères de recherche
        </p>
      </div>
    );
  }

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        borderRadius: "12px", 
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <DishTableStyled sx={{ height: "100%" }}>
        <Table sx={{ minWidth: 700, height: "100%" }} aria-label="dishes table">
          <TableHead>
            <TableRow>
              <DishTableCellStyled>Plat</DishTableCellStyled>
              <DishTableCellStyled align="left">Ingrédients</DishTableCellStyled>
              <DishTableCellStyled align="left">Statut</DishTableCellStyled>
              <DishTableCellStyled align="right">Catégorie</DishTableCellStyled>
              <DishTableCellStyled align="right">Prix</DishTableCellStyled>
              <DishTableCellStyled align="right">Actions</DishTableCellStyled>
            </TableRow>
          </TableHead>
          
          <TableBody sx={{ flex: 1 }}>
            <AnimatePresence>
              {paginatedDishes.map((dish, index) => (
                <motion.tr
                  key={dish._id}
                  component={TableRow}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  onClick={() => setSelectedDish(dish)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(59, 130, 246, 0.04)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <DishRow
                    row={dish}
                    onClick={setSelectedDish}
                    onDelete={onDelete}
                  />
                </motion.tr>
              ))}
            </AnimatePresence>
            
            {emptyRows > 0 && (
              <TableRow style={{ height: 73 * emptyRows }}>
                <DishTableCellStyled colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          
          <TableFooter>
            <TableRow>
              <DishTableCellStyled colSpan={6}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1 }}>
                  <div className="text-sm text-gray-600">
                    Affichage de {page * rowsPerPage + 1} à {Math.min((page + 1) * rowsPerPage, displayedDishes.length)} sur {displayedDishes.length} plats
                  </div>
                  <TablePagination
                    sx={{ borderBottom: 0 }}
                    rowsPerPageOptions={[10]}
                    component="div"
                    count={displayedDishes.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    ActionsComponent={TablePaginationActions}
                    labelDisplayedRows={() => ''}
                    labelRowsPerPage=""
                  />
                </Box>
              </DishTableCellStyled>
            </TableRow>
          </TableFooter>
        </Table>
      </DishTableStyled>
    </Paper>
  );
};

export default DishesTable;