export enum TypeButton {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  TEXT = "text",
}

export enum WidthButton {
  LARGE = "large",
  MEDIUM = "medium",
  SMALL = "small",
}

export interface CustomButtonProps {
  inputType?: "submit" | "reset" | "button";
  type: TypeButton;
  children: React.ReactNode;
  onClick: () => void;
  width: WidthButton;
  isLoading: boolean;
  isDisabled?: boolean;
  ariaLabel?: string;
}
