import { Table, TableBody, TableHead, TableRow } from "@mui/material";
import React from "react";
import { DishRow } from "./dish.row";
import { DishTableCellStyled, DishTableStyled } from "./dish.styled";
import { DishesTableProps } from "./dish.props";

const DishesTable: React.FC<DishesTableProps> = ({
  dishes,
  setSelectedDish,
  onDelete,
}) => {
  return (
    <DishTableStyled>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
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
          {dishes.map((dish) => (
            <DishRow
              key={dish._id}
              row={dish}
              onClick={setSelectedDish}
              onDelete={onDelete}
            />
          ))}
          {dishes.length === 0 && (
            <TableRow>
              <DishTableCellStyled colSpan={6} align="center">
                <div className="py-12 text-center">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun plat trouvé
                  </h3>
                  <p className="text-gray-600">
                    Modifiez vos critères de recherche ou ajoutez de nouveaux plats
                  </p>
                </div>
              </DishTableCellStyled>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </DishTableStyled>
  );
};

export default DishesTable;
