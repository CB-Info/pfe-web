import { ReactNode } from "react";
import { css, styled } from "styled-components";
import tw from "twin.macro";

interface CellProps {
  isImage: boolean;
  $isError?: boolean;
}

function getPadding(isImage: boolean) {
  if (isImage) {
    return tw`px-2`;
  }

  return tw`px-7`;
}

const CellButtonStyle = styled.div<CellProps>(
  ({ theme, $isError: isError = false, isImage }) => [
    tw`
        flex
        w-full
        rounded
        font-inter
        text-sm
        py-1
        cursor-pointer
        items-center
        gap-1.5
    `,
    css`
      ${getPadding(isImage)}
      &:hover {
        background-color: ${isError ? theme.errorPastelColor : theme.blue100};
        color: ${isError ? theme.errorColor : theme.blackColor};
      }
    `,
  ]
);

interface CellButtonType {
  onClick: () => void;
  label: string;
  image?: ReactNode;
  isError?: boolean;
}

export const CellButton: React.FC<CellButtonType> = ({
  onClick,
  label,
  image,
  isError = false,
}) => {
  return (
    <CellButtonStyle
      onClick={onClick}
      $isError={isError}
      isImage={image != null ? true : false}
    >
      {image}
      {label}
    </CellButtonStyle>
  );
};
