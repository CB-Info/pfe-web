import React, { ChangeEvent } from 'react';
import styled, { DefaultTheme, css } from "styled-components"
import tw, { theme } from 'twin.macro'

interface TextInputProps {
  label: string,
  value: string | number,
  onChange: (newValue: string) => void,
  type?: 'text' | 'password' | 'email' | 'textarea' | 'number',
  isError: boolean,
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
        rounded-lg
        border
      `,
  // Ensuite, ajoutez les styles dynamiques basés sur le thème ou les props
  css`
        border-color: ${getBorderColor(theme, isError, isDisabled)};
        color: ${isError ? theme.errorColor : theme.textColor};
        background-color: ${isDisabled ? theme.disabledBackgroundColor : '#FFFFFF'};
        cursor: ${isDisabled ? 'not-allowed' : 'text'};
        opacity: ${isDisabled ? '0.6' : '1'};
      `,
]);

const Textarea = styled(BaseInput).attrs({ as: 'textarea' })`
  height: 150px; 
  resize: none;
`;

export const TextInput: React.FC<TextInputProps> = ({ label, type = "text", isError, isDisabled, value, onChange }) => {
  return (
    <div>
      <span className="text-primary-color text-sm">{label}</span>
      {
        type === 'textarea' ? (
          <Textarea value={value} disabled={isDisabled} isDisabled={isDisabled} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {onChange(e.target.value)}} isError={isError} />
        ) : (
          <BaseInput type={type} value={value} disabled={isDisabled} isDisabled={isDisabled} onChange={(e: ChangeEvent<HTMLInputElement>) => {onChange(e.target.value)}} isError={isError} />
        )
      }
    </div>
  );
};