import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';
import styled, { css } from "styled-components"
import tw from 'twin.macro'
import { Modal } from '../modals/modal';
import LabelStyle from '../../style/label.style';

interface TextfieldListProps {
    valuesToDisplay: string[]
    onClicked: (value: string) => void
    label: string
    defaultValue?: string
}

const Cell = styled.div(({ theme }) => [
    tw`
        rounded
        p-1.5
        font-inter
        text-sm
        font-medium
        cursor-pointer
        select-none
    `,
    css`
      color: ${theme.blue500};

      &:hover {
        background-color: ${theme.blue100};
      }
    `,
]);

export const TextfieldList: React.FC<TextfieldListProps> = ({ valuesToDisplay, onClicked, label, defaultValue }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(defaultValue || valuesToDisplay[0]);

    const handleCellClick = (value: string) => {
        onClicked(value);
        setSelectedValue(value);
        setIsOpen(false)
    };

    return (
        <div className="flex flex-col w-full relative">
            <LabelStyle>{label}</LabelStyle>
            <div className="flex border border-solid bg-white border-blue-sky justify-between items-center rounded-lg p-3 cursor-pointer" onClick={() => setIsOpen(!isOpen)} >
                <span className='text-textfield-color font-inter text-sm select-none'>{selectedValue}</span>
                <KeyboardArrowDownIcon className='text-slate-400' />
            </div>
            {isOpen && (
                <Modal onClose={() => setIsOpen(false)} fullWidth>
                    {valuesToDisplay.map((element, index) => (
                        <Cell key={index} onClick={() => handleCellClick(element)}>{element}</Cell>
                    ))}
                </Modal>
            )}
        </div>
    )
}

export default TextfieldList;
