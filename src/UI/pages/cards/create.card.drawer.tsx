import React from "react";
import CardForm from "../../components/forms/card/card.form";
import { CardFormMode } from "../../components/forms/card/card.form.props";
import { CardDto } from "../../../data/dto/card.dto";

interface CreateCardDrawerProps {
  onSubmitSuccess: (card: CardDto) => void;
}

const CreateCardDrawer: React.FC<CreateCardDrawerProps> = ({ onSubmitSuccess }) => {
  function handleOnClosePage() {
    const drawerCheckbox = document.getElementById(
      "add-drawer-card"
    ) as HTMLInputElement;
    if (drawerCheckbox) {
      drawerCheckbox.checked = !drawerCheckbox.checked;
    }
  }

  return (
    <CardForm
      mode={CardFormMode.CREATE}
      onSubmitSuccess={() => {
        handleOnClosePage();
      }}
      onCancel={() => {
        handleOnClosePage();
      }}
    />
  );
};

export default CreateCardDrawer;