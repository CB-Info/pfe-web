import React from "react";
import DishForm from "../../components/forms/dish/dish.form";
import { DishFormMode } from "../../components/forms/dish/dish.form.props";

interface AddDishPageProps {
  onClickOnConfirm: () => void;
}

const AddDishPage: React.FC<AddDishPageProps> = ({ onClickOnConfirm }) => {
  function handleOnClosePage() {
    const drawerCheckbox = document.getElementById(
      "add-drawer-dish"
    ) as HTMLInputElement;
    if (drawerCheckbox) {
      drawerCheckbox.checked = !drawerCheckbox.checked;
    }
  }

  return (
    <div className="h-full">
      <DishForm
        mode={DishFormMode.CREATE}
        onSubmitSuccess={() => {
          handleOnClosePage();
          onClickOnConfirm();
        }}
        onCancel={() => {
          handleOnClosePage();
        }}
      />
    </div>
  );
};

export default AddDishPage;