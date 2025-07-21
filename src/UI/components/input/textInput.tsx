import React, { ChangeEvent } from 'react';
import styled, { DefaultTheme, css } from "styled-components"
import tw from 'twin.macro'
import LabelStyle from '../../style/label.style';

interface TextInputProps {
  name: string | undefined
  label: string,
  value: string | number,
  onChange: (newValue: string) => void,
  type?: 'text' | 'password' | 'email' | 'textarea' | 'number' | 'checkbox',
  $isError: boolean,
  $isDisabled: boolean,
}

const getBorderColor = (theme: DefaultTheme, isError: boolean | undefined, isDisabled: boolean | undefined) => {
  if (isDisabled) return theme.disabledBorderColor;
  if (isError) return theme.errorColor;
  return theme.borderColor;
};

const BaseInput = styled.input<{ $isError: boolean, $isDisabled: boolean }>(({ theme, $isError, $isDisabled }) => [
  tw`
        text-sm
        font-inter
        p-3
        w-full
        rounded-lg
        border
        transition-all
        duration-200
        focus:ring-2
        focus:ring-blue-500
        focus:border-blue-500
      `,
  css`
        border-color: ${getBorderColor(theme, $isError, $isDisabled)};
        color: ${$isError ? theme.errorColor : '#232323'};
        background-color: ${$isDisabled ? theme.disabledBackgroundColor : '#FFFFFF'};
        cursor: ${$isDisabled ? 'not-allowed' : 'text'};
        opacity: ${$isDisabled ? '0.6' : '1'};
        &:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      `,
]);

const Textarea = styled(BaseInput).attrs({ as: 'textarea' })`
  min-height: 120px; 
  resize: none;
  
  @media (max-width: 768px) {
    min-height: 100px;
  }
`;

export const TextInput: React.FC<TextInputProps> = ({ name = undefined, label, type = "text", $isError, $isDisabled, value, onChange }) => {
  return (
    <div>
      <LabelStyle>{label}</LabelStyle>
      {
        type === 'textarea' ? (
          <Textarea 
            name={name}
            value={value} 
            disabled={$isDisabled} 
            $isDisabled={$isDisabled} 
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => { onChange(e.target.value) }} 
            $isError={$isError} 
            aria-invalid={$isError}
            aria-describedby={$isError ? `${name}-error` : undefined}
          />
        ) : (
          <BaseInput 
            name={name} 
            type={type} 
            value={value} 
            disabled={$isDisabled}
            $isDisabled={$isDisabled}
            onChange={(e: ChangeEvent<HTMLInputElement>) => { onChange(e.target.value) }} 
            $isError={$isError} 
            aria-invalid={$isError}
            aria-describedby={$isError ? `${name}-error` : undefined}
          />
        )
      }
    </div>
  );
};
