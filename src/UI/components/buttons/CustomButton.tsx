import { CircularProgress } from "@mui/material";
import styled from "styled-components";
import tw from "twin.macro";
import { TypeButton, WidthButton, CustomButtonProps } from "./types";

// Helper function to get button size styles
const getButtonSize = (width: WidthButton) => {
  switch (width) {
    case WidthButton.LARGE:
      return tw`min-w-[180px] h-[60px] text-base px-10`;
    case WidthButton.MEDIUM:
      return tw`min-w-[150px] h-[48px] text-base px-8`;
    case WidthButton.SMALL:
      return tw`min-w-[60px] h-[40px] text-sm px-6`;
  }
};

// Helper function to get button type styles
const getButtonTypeStyles = (type: TypeButton, isDisabled: boolean) => {
  if (isDisabled) {
    return tw`bg-gray-300 text-gray-500 cursor-not-allowed`;
  }

  switch (type) {
    case TypeButton.PRIMARY:
      return tw`
        bg-blue-600 text-white 
        hover:bg-blue-700 
        active:bg-blue-800
        focus:ring-2 focus:ring-blue-300
      `;
    case TypeButton.SECONDARY:
      return tw`
        bg-gray-200 text-gray-800 
        hover:bg-gray-300 
        active:bg-gray-400
        focus:ring-2 focus:ring-gray-300
      `;
    case TypeButton.TEXT:
      return tw`
        bg-transparent text-blue-600 
        hover:bg-blue-50 
        active:bg-blue-100
        focus:ring-2 focus:ring-blue-300
      `;
  }
};

interface StyledButtonProps {
  $width: WidthButton;
  $type: TypeButton;
  $isDisabled: boolean;
  $isLoading: boolean;
}

const StyledButton = styled.button<StyledButtonProps>`
  ${tw`
    flex
    items-center
    justify-center
    rounded-xl
    font-inter
    font-semibold
    transition-all
    duration-200
    focus:outline-none
    focus:ring-opacity-50
  `}

  ${({ $width }) => getButtonSize($width)}
  ${({ $type, $isDisabled }) => getButtonTypeStyles($type, $isDisabled)}
  
  ${({ $isLoading }) => $isLoading && tw`opacity-80 cursor-wait`}
`;

const CustomButton: React.FC<CustomButtonProps> = ({
  inputType = "button",
  type,
  children,
  onClick,
  width,
  isLoading,
  isDisabled = false,
  ariaLabel,
}) => {
  const handleClick = () => {
    if (!isDisabled && !isLoading) {
      onClick();
    }
  };

  return (
    <StyledButton
      type={inputType}
      onClick={handleClick}
      $width={width}
      $type={type}
      $isDisabled={isDisabled}
      $isLoading={isLoading}
      disabled={isDisabled || isLoading}
      aria-label={ariaLabel}
    >
      {isLoading ? (
        <CircularProgress
          size={width === WidthButton.SMALL ? 16 : 20}
          color="inherit"
        />
      ) : (
        children
      )}
    </StyledButton>
  );
};

export default CustomButton;
