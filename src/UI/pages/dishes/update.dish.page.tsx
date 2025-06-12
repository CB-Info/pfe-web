import React from "react";
import { Dish } from "../../../data/models/dish.model";
import DishForm from "../../components/forms/dish/dish.form";
import { DishFormMode } from "../../components/forms/dish/dish.form.props";

interface UpdateDishPageProps {
  dish: Dish;
  onClickOnConfirm: () => void;
}

const UpdateDishPage: React.FC<UpdateDishPageProps> = ({
  dish,
  onClickOnConfirm,
}) => {
  function handleOnClosePage() {
    const drawerCheckbox = document.getElementById(
      "update-dish-drawer"
    ) as HTMLInputElement;
    if (drawerCheckbox) {
      drawerCheckbox.checked = !drawerCheckbox.checked;
    }
    onClickOnConfirm();
  }

  return (
    <>
      <DishForm
        mode={DishFormMode.UPDATE}
        dish={dish}
        onSubmitSuccess={() => {
          handleOnClosePage();
        }}
        onCancel={() => {
          handleOnClosePage();
        }}
      />
    </>
  );
};

export default UpdateDishPage;