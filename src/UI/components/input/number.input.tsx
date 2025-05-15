import React, { ChangeEvent } from 'react';
import styled, { DefaultTheme, css } from "styled-components";
import tw from 'twin.macro';
import { motion } from 'framer-motion';
import EuroRoundedIcon from '@mui/icons-material/EuroRounded';
import LabelStyle from '../../style/label.style';
import { cn } from '../../../utils/cn';

interface NumberInputProps {
  name: string | undefined;
  label: string;
  value: string | number;
  onChange: (newValue: string) => void;
  onBlur?: () => void;
  type?: 'number';
  $isError: boolean;
  $isDisabled: boolean;
  helperText?: string;
  required?: boolean;
  placeholder?: string;
}

const getBorderColor = (theme: DefaultTheme, isError: boolean | undefined, isDisabled: boolean | undefined) => {
  if (isDisabled) return theme.disabledBorderColor;
  if (isError) return theme.errorColor;
  return theme.borderColor;
};

const BaseInput = styled(motion.input)<{ $isError: boolean, $isDisabled: boolean }>(({ theme, $isError, $isDisabled }) => [
  tw`
    text-sm
    font-inter
    p-3
    w-full
    rounded-l-lg
    border
    transition-all
    duration-200
    ease-in-out
  `,
  css`
    border-color: ${getBorderColor(theme, $isError, $isDisabled)};
    color: ${$isError ? theme.errorColor : theme.textColor};
    background-color: ${$isDisabled ? theme.disabledBackgroundColor : '#FFFFFF'};
    cursor: ${$isDisabled ? 'not-allowed' : 'text'};
    opacity: ${$isDisabled ? '0.6' : '1'};
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px ${$isError ? theme.errorColor : theme.blue500}20;
      border-color: ${$isError ? theme.errorColor : theme.blue500};
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  `,
]);

const IconContainer = styled.div<{ $isError: boolean }>(({ theme, $isError }) => [
  tw`
    p-2.5
    h-full
    text-sm
    font-medium
    rounded-e-lg
    border
    border-l-0
    transition-all
    duration-200
    flex
    items-center
    justify-center
  `,
  css`
    background-color: ${theme.disabledBackgroundColor};
    border-color: ${getBorderColor(theme, $isError, false)};
    color: ${$isError ? theme.errorColor : theme.textColor};
  `,
]);

const HelperText = styled.span<{ $isError: boolean }>(({ theme, $isError }) => [
  tw`text-xs mt-1 block`,
  css`
    color: ${$isError ? theme.errorColor : theme.placeholderColor};
  `,
]);

const RequiredAsterisk = styled.span(({ theme }) => [
  tw`text-xs ml-1`,
  css`color: ${theme.errorColor};`,
]);

export const NumberInput: React.FC<NumberInputProps> = ({
  name = undefined,
  label,
  type = "number",
  $isError,
  $isDisabled,
  value,
  onChange,
  onBlur,
  helperText,
  required = false,
  placeholder,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value !== "0") {
      onChange(value);
    } else {
      onChange("");
    }
  };

  const inputProps = {
    name,
    value,
    disabled: $isDisabled,
    $isDisabled,
    onChange: handleChange,
    onBlur,
    $isError,
    placeholder,
    required,
    type,
    className: cn(
      "focus:ring-2",
      $isError ? "focus:ring-red-500" : "focus:ring-blue-500"
    ),
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <LabelStyle>{label}</LabelStyle>
        {required && <RequiredAsterisk>*</RequiredAsterisk>}
      </div>
      <div className="flex">
        <BaseInput
          {...inputProps}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
        <IconContainer $isError={$isError}>
          <EuroRoundedIcon className="opacity-70" />
        </IconContainer>
      </div>
      {helperText && (
        <HelperText $isError={$isError}>
          {helperText}
        </HelperText>
      )}
    </div>
  );
};