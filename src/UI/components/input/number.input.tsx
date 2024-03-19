import React, { ChangeEvent } from 'react';
import styled, { DefaultTheme, css } from "styled-components"
import tw, { theme } from 'twin.macro'
import EuroRoundedIcon from '@mui/icons-material/EuroRounded';

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
  // Appliquez d'abord les styles Tailwind fixes via tw
  tw`
        text-sm
        font-inter
        p-3
        w-full
        rounded-l-lg
        border
      `,
  // Ensuite, ajoutez les styles dynamiques basés sur le thème ou les props
  css`
        border-color: ${getBorderColor(theme, isError, isDisabled)};
        color: ${isError ? theme.errorColor : theme.textColor};
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
        <span className="text-primary-color text-sm pb-2">{label}</span>
      <div className='flex'>
        <BaseInput name={name} type={type} value={value} disabled={isDisabled} isDisabled={isDisabled} onChange={handleOnChange} isError={isError} />
        <div className="p-2.5 h-full text-sm font-medium text-slate-400 bg-slate-100 rounded-e-lg border border-primary-color focus:outline-none">
          <EuroRoundedIcon className="opacity-70" />
        </div>
      </div>
    </div>
  );
};