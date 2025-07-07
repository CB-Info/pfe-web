import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  TableFooter,
  TablePagination,
  useTheme,
} from "@mui/material";
import React from "react";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { DishRow } from "./dish.row";
import { DishTableCellStyled, DishTableStyled } from "./dish.styled";
import { DishesTableProps, TablePaginationActionsProps } from "./dish.props";

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

  return (
    <Paper elevation={0} sx={{ borderRadius: "16px", overflow: "visible" }}>
      <DishTableStyled>
        <Table sx={{ minWidth: 700, tableLayout: "auto" }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <DishTableCellStyled>Nom</DishTableCellStyled>
              <DishTableCellStyled align="left">
                Ingrédients
              </DishTableCellStyled>
              <DishTableCellStyled align="left">Status</DishTableCellStyled>
              <DishTableCellStyled align="right">Catégorie</DishTableCellStyled>
              <DishTableCellStyled align="right">Prix</DishTableCellStyled>
              <DishTableCellStyled align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? displayedDishes.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : displayedDishes
            ).map((dish) => (
              <DishRow
                key={dish._id}
                row={dish}
                onClick={setSelectedDish}
                onDelete={onDelete}
              />
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", overflow: "visible" }}>
                  <TablePagination
                    sx={{ borderBottom: 0 }}
                    rowsPerPageOptions={[10]}
                    colSpan={3}
                    count={displayedDishes.length}
                    rowsPerPage={10}
                    page={page}
                    onPageChange={handleChangePage}
                    ActionsComponent={TablePaginationActions}
                  />
                </Box>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </DishTableStyled>
    </Paper>
  );
};

export default DishesTable;
