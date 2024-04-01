import React, { ChangeEvent } from 'react';
import styled, { DefaultTheme, css } from "styled-components"
import tw, { theme } from 'twin.macro'
import LabelStyle from '../../style/label.style';

interface TextInputProps {
  name: string | undefined
  label: string,
  value: string | number,
  onChange: (newValue: string) => void,
  type?: 'text' | 'password' | 'email' | 'textarea' | 'number' | 'checkbox',
  isError: boolean,
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
        rounded-lg
        border
      `,
  css`
        border-color: ${getBorderColor(theme, isError, isDisabled)};
        color: ${isError ? theme.errorColor : '#232323'};
        background-color: ${isDisabled ? theme.disabledBackgroundColor : '#FFFFFF'};
        cursor: ${isDisabled ? 'not-allowed' : 'text'};
        opacity: ${isDisabled ? '0.6' : '1'};
      `,
]);

const Textarea = styled(BaseInput).attrs({ as: 'textarea' })`
  height: 150px; 
  resize: none;
`;

export const TextInput: React.FC<TextInputProps> = ({  name = undefined , label, type = "text", isError, isDisabled, value, onChange }) => {
  return (
    <div>
      <LabelStyle>{label}</LabelStyle>
      {
        type === 'textarea' ? (
          <Textarea name={name} value={value} disabled={isDisabled} isDisabled={isDisabled} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {onChange(e.target.value)}} isError={isError} />
        ) : (
          <BaseInput name={name} type={type} value={value} disabled={isDisabled} isDisabled={isDisabled} onChange={(e: ChangeEvent<HTMLInputElement>) => {onChange(e.target.value)}} isError={isError} />
        )
      }
    </div>
  );
};