import { ReactNode } from "react";
import styled from "styled-components";
import tw from "twin.macro";

interface CellButtonProps {
  onClick: () => void;
  label: string;
  isError?: boolean;
  image?: ReactNode;
}

interface StyledCellProps {
  $isError: boolean;
  $hasImage: boolean;
}

const StyledCellButton = styled.button<StyledCellProps>`
  ${tw`
    flex
    items-center
    justify-center
    gap-2
    rounded-lg
    py-2
    font-inter
    text-sm
    font-medium
    transition-all
    duration-200
    focus:outline-none
    focus:ring-2
    focus:ring-opacity-50
  `}

  ${({ $hasImage }) => ($hasImage ? tw`px-2` : tw`px-7`)}
  
  ${({ $isError }) =>
    $isError
      ? tw`
          bg-red-100 text-red-700 border border-red-300
          hover:bg-red-200 
          focus:ring-red-300
        `
      : tw`
          bg-gray-100 text-gray-800 border border-gray-300
          hover:bg-gray-200 
          focus:ring-gray-300
        `}
`;

const CellButton: React.FC<CellButtonProps> = ({
  onClick,
  label,
  isError = false,
  image,
}) => {
  return (
    <StyledCellButton onClick={onClick} $isError={isError} $hasImage={!!image}>
      {image && <span className="flex-shrink-0">{image}</span>}
      <span>{label}</span>
    </StyledCellButton>
  );
};

export default CellButton;
