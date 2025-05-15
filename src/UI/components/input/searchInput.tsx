import React, { ChangeEvent } from 'react';
import styled, { css } from "styled-components";
import tw from 'twin.macro';
import { motion } from 'framer-motion';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LabelStyle from '../../style/label.style';
import { cn } from '../../../utils/cn';

interface SearchInputProps {
  label: string;
  error?: boolean;
  disabled?: boolean;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  helperText?: string;
}

const Input = styled(motion.input)(({ theme }) => [
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
    border-color: ${theme.borderColor};
    color: ${theme.textColor};
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px ${theme.blue500}20;
      border-color: ${theme.blue500};
    }
    
    &::placeholder {
      color: ${theme.placeholderColor};
    }
  `,
]);

const IconButton = styled.button(({ theme }) => [
  tw`
    absolute
    top-0
    end-0
    p-2.5
    h-full
    text-sm
    font-medium
    rounded-e-lg
    border-l-0
    transition-all
    duration-200
    focus:outline-none
  `,
  css`
    background-color: ${theme.disabledBackgroundColor};
    border-color: ${theme.borderColor};
    color: ${theme.placeholderColor};
    
    &:hover {
      background-color: ${theme.blue500}10;
    }
  `,
]);

const HelperText = styled.span<{ $isError?: boolean }>(({ theme, $isError }) => [
  tw`text-xs mt-1 block`,
  css`
    color: ${$isError ? theme.errorColor : theme.placeholderColor};
  `,
]);

export const SearchInput: React.FC<SearchInputProps> = ({
  label,
  error = false,
  disabled = false,
  name,
  value,
  onChange,
  placeholder,
  helperText,
}) => {
  return (
    <div className="flex flex-col w-full">
      <LabelStyle>{label}</LabelStyle>
      <div className="relative flex items-center">
        <Input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "pr-12",
            error ? "border-red-500" : "border-gray-300",
            disabled && "bg-gray-100 cursor-not-allowed"
          )}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
        <IconButton type="button" className="hover:bg-gray-100">
          <SearchRoundedIcon className="w-5 h-5 opacity-70" />
        </IconButton>
      </div>
      {helperText && (
        <HelperText $isError={error}>
          {helperText}
        </HelperText>
      )}
    </div>
  );
};