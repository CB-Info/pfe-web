import React, { ChangeEvent } from 'react';
import styled, { DefaultTheme, css } from "styled-components"
import tw from 'twin.macro'
import { motion } from 'framer-motion';
import LabelStyle from '../../style/label.style';
import { cn } from '../../../utils/cn';

interface TextInputProps {
  name: string | undefined;
  label: string;
  value: string | number;
  onChange: (newValue: string) => void;
  type?: 'text' | 'password' | 'email' | 'textarea' | 'number' | 'checkbox';
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
    rounded-lg
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
    
    &::placeholder {
      color: ${theme.placeholderColor};
    }
  `,
]);

const Textarea = styled(BaseInput).attrs({ as: 'textarea' })`
  height: 150px;
  resize: none;
`;

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

export const TextInput: React.FC<TextInputProps> = ({
  name = undefined,
  label,
  type = "text",
  $isError,
  $isDisabled,
  value,
  onChange,
  helperText,
  required = false,
  placeholder,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const inputProps = {
    name,
    value,
    disabled: $isDisabled,
    $isDisabled,
    onChange: handleChange,
    $isError,
    placeholder,
    required,
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
      
      {type === 'textarea' ? (
        <Textarea {...inputProps} as="textarea" />
      ) : (
        <BaseInput
          type={type}
          {...inputProps}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
      
      {helperText && (
        <HelperText $isError={$isError}>
          {helperText}
        </HelperText>
      )}
    </div>
  );
};