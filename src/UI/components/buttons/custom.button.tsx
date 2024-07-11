import { CircularProgress } from '@mui/material';
import { ReactNode } from 'react';
import styled, { css } from "styled-components"
import tw from 'twin.macro'

export enum TypeButton {
    "PRIMARY",
    "SECONDARY",
    "TEXT"
}

export enum WidthButton {
    "LARGE",
    "MEDIUM",
    "SMALL"
}

interface CustomButtonProps {
    inputType?: "submit" | "reset" | "button"| undefined
    type: TypeButton
    children: ReactNode
    onClick: () => void
    width: WidthButton
    isLoading: boolean
    isDisabled?: boolean
}


const getSize = (width: WidthButton) => {
    switch (width) {
        case WidthButton.LARGE:
            return tw`min-w-[180px] h-[60px]`;
        case WidthButton.MEDIUM:
            return tw`min-w-[150px] h-[48px]`;
        case WidthButton.SMALL:
            return tw`min-w-[60px] h-[40px]`;
    }
}

interface PrimaryButtonProps {
    $width: WidthButton;
    $isDisabled: boolean
    $isLoading: boolean
}

const PrimaryButton = styled.button<PrimaryButtonProps>(({ theme, $width: width = WidthButton.MEDIUM, $isDisabled: isDisabled, $isLoading: isLoading }) => [
    tw`
        flex
        rounded-2xl
        p-1.5
        font-inter
        text-base
        font-semibold
        py-3
        px-10
        justify-center
        items-center
        gap-1
        shadow-md
    `,
    css`
      ${getSize(width)}
      color: ${theme.buttonText};
      background-color: ${theme.blue500};
      opacity: ${isDisabled ? 0.6 : 1};
      cursor: ${isDisabled || isLoading ? "default" : "pointer"};
      ${(isDisabled) => isDisabled ? '' : `&:hover { background-color: ${theme.blue600}; }`}
      ${(isLoading) => isLoading ? '' : `&:hover { background-color: ${theme.blue600}; }`}
    `,
]);

const SecondaryButton = styled.button<PrimaryButtonProps>(({ theme, $width: width = WidthButton.MEDIUM, $isDisabled: isDisabled, $isLoading: isLoading }) => [
    tw`
        flex
        rounded-2xl
        p-1.5
        font-inter
        text-base
        font-semibold
        py-3
        px-10
        justify-center
        items-center
        gap-1
        shadow-md
    `,
    css`
      ${getSize(width)}
      color: ${theme.blue600};
      border: 1px solid ${theme.blue500};
      background-color: ${theme.buttonText};
      opacity: ${isDisabled ? 0.6 : 1};
      cursor: ${isDisabled || isLoading ? "default" : "pointer"};
    `,
]);

const TextButton = styled.button<PrimaryButtonProps>(({ theme, $width: width = WidthButton.MEDIUM, $isDisabled: isDisabled, $isLoading: isLoading }) => [
    tw`
        flex
        rounded-2xl
        p-1.5
        font-inter
        text-base
        font-semibold
        py-3
        px-10
        justify-center
        items-center
        gap-1
    `,
    css`
      ${getSize(width)}
      color: ${theme.blue600};
      opacity: ${isDisabled ? 0.6 : 1};
      cursor: ${isDisabled || isLoading ? "default" : "pointer"};
      text-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `,
]);

export const CustomButton: React.FC<CustomButtonProps> = ({ inputType = "button", type, width = WidthButton.MEDIUM, children, onClick, isLoading = false, isDisabled = false }) => {
    switch (type) {
        case TypeButton.PRIMARY:
            return (
                <PrimaryButton
                    type={inputType}
                    onClick={isDisabled || isLoading ? () => {}  : () => {onClick()}} 
                    $width={width} 
                    $isDisabled={isDisabled} 
                    $isLoading={isLoading}>
                {isLoading ? <CircularProgress size={20}/> : children}
                </PrimaryButton>
            )

        case TypeButton.SECONDARY:
            return (
                <SecondaryButton 
                    type={inputType}
                    onClick={isDisabled || isLoading ? () => {}  : () => {onClick()}} 
                    $width={width} 
                    $isDisabled={isDisabled} 
                    $isLoading={isLoading}>
                {isLoading ? <CircularProgress size={20}/> : children}
                </SecondaryButton>
            )

        case TypeButton.TEXT:
            return (
                <TextButton
                    type={inputType}
                    onClick={isDisabled || isLoading ? () => {}  : () => {onClick()}} 
                    $width={width}
                    $isDisabled={isDisabled} 
                    $isLoading={isLoading}>
                {isLoading ? <CircularProgress size={20}/> : children}
                </TextButton>
            )
    }
}

export default CustomButton