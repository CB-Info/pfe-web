import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';
import styled, { css } from "styled-components";
import tw from 'twin.macro';
import { motion } from 'framer-motion';
import { Modal } from '../modals/modal';
import LabelStyle from '../../style/label.style';

interface TextfieldListProps {
  valuesToDisplay: string[];
  onClicked: (value: string) => void;
  label: string;
  error?: boolean;
  required?: boolean;
  helperText?: string;
}

const Cell = styled(motion.div)(({ theme }) => [
  tw`
    rounded
    p-1.5
    font-inter
    text-sm
    font-medium
    cursor-pointer
    select-none
    transition-all
    duration-200
  `,
  css`
    color: ${theme.blue500};

    &:hover {
      background-color: ${theme.blue100};
    }
  `,
]);

const SelectButton = styled.div<{ $error?: boolean }>(({ theme, $error }) => [
  tw`
    flex
    border
    border-solid
    bg-white
    justify-between
    items-center
    rounded-lg
    p-3
    cursor-pointer
    transition-all
    duration-200
  `,
  css`
    border-color: ${$error ? theme.errorColor : theme.borderColor};
    
    &:hover {
      border-color: ${$error ? theme.errorColor : theme.blue500};
      background-color: ${theme.blue500}05;
    }
  `,
]);

const RequiredAsterisk = styled.span(({ theme }) => [
  tw`text-xs ml-1`,
  css`color: ${theme.errorColor};`,
]);

const HelperText = styled.span<{ $isError?: boolean }>(({ theme, $isError }) => [
  tw`text-xs mt-1 block`,
  css`
    color: ${$isError ? theme.errorColor : theme.placeholderColor};
  `,
]);

export const TextfieldList: React.FC<TextfieldListProps> = ({
  valuesToDisplay,
  onClicked,
  label,
  error = false,
  required = false,
  helperText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(valuesToDisplay[0]);

  const handleCellClick = (value: string) => {
    onClicked(value);
    setSelectedValue(value);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col w-full relative">
      <div className="flex items-center">
        <LabelStyle>{label}</LabelStyle>
        {required && <RequiredAsterisk>*</RequiredAsterisk>}
      </div>
      
      <SelectButton
        onClick={() => setIsOpen(!isOpen)}
        $error={error}
      >
        <span className="text-textfield-color font-inter text-sm select-none">
          {selectedValue}
        </span>
        <KeyboardArrowDownIcon className="text-slate-400" />
      </SelectButton>
      
      {helperText && (
        <HelperText $isError={error}>
          {helperText}
        </HelperText>
      )}
      
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)} fullWidth>
          {valuesToDisplay.map((element, index) => (
            <Cell
              key={index}
              onClick={() => handleCellClick(element)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              {element}
            </Cell>
          ))}
        </Modal>
      )}
    </div>
  );
};

export default TextfieldList;