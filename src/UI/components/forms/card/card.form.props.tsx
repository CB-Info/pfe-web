export enum CardFormMode {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
}

export interface CardFormProps {
  mode: CardFormMode;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}