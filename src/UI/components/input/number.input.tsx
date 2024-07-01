import React, { ChangeEvent } from 'react';
import styled, { DefaultTheme, css } from "styled-components"
import tw from 'twin.macro'
import EuroRoundedIcon from '@mui/icons-material/EuroRounded';
import LabelStyle from '../../style/label.style';

interface NumberInputProps {
  name: string | undefined
  label: string,
  value: string | number,
  onChange: (newValue: string) => void,
  type?: 'number',
  isError?: boolean,
  isDisabled?: boolean,
}

const getBorderColor = (theme: DefaultTheme, isError: boolean | undefined, isDisabled: boolean | undefined) => {
  if (isDisabled) return theme.disabledBorderColor;
  if (isError) return theme.errorColor;
  return theme.borderColor; // Couleur par défaut si ni isError ni isDisabled
};

const BaseInput = styled.input<{ isError?: boolean, isDisabled?: boolean }>(({ theme, isError, isDisabled }) => [
  tw`
        text-sm
        font-inter
        p-3
        w-full
        rounded-l-lg
        border
      `,
  css`
        border-color: ${getBorderColor(theme, isError, isDisabled)};
        color: ${isError ? theme.errorColor : '#232323'};
        background-color: ${isDisabled ? theme.disabledBackgroundColor : '#FFFFFF'};
        cursor: ${isDisabled ? 'not-allowed' : 'text'};
        opacity: ${isDisabled ? '0.6' : '1'};
        &:focus{
          outline: ${isError ? 'none' : ''};
        }
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
         -webkit-appearance: none;
      }
      `,
]);

export const NumberInput: React.FC<NumberInputProps> = ({ name = undefined, label, type = "number", isError, isDisabled, value, onChange }) => {

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value

    if (value != "0") {
      onChange(e.target.value)
    } else {
      onChange("")
    }
  }

  return (
    <div className='flex flex-col'>
        <LabelStyle>{label}</LabelStyle>
      <div className='flex'>
        <BaseInput name={name} type={type} value={value} disabled={isDisabled} isDisabled={isDisabled} onChange={handleOnChange} isError={isError} />
        <div className="p-2.5 h-full text-sm font-medium text-slate-400 bg-slate-100 rounded-e-lg border border-primary-color focus:outline-none">
          <EuroRoundedIcon className="opacity-70" />
        </div>
      </div>
    </div>
  );
};