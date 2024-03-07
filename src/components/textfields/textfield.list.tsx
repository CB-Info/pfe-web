import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Dispatch, SetStateAction, useState } from 'react';
import styled, { css } from "styled-components"
import tw from 'twin.macro'

interface TextfieldListProps {
    valuesToDisplay: string[]
    onClicked: Dispatch<SetStateAction<string>>
}

export const TextfieldList: React.FC<TextfieldListProps> = ({ valuesToDisplay, onClicked }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(valuesToDisplay[0]);

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

    const handleCellClick = (value: string) => {
        onClicked(value);
        setSelectedValue(value);
        setIsOpen(false)
    };

    return (
        <div className="flex flex-col w-full relative">
            <span className='font-inter text-sm pb-2 select-none'>Nom du plat</span>
            <div className="flex border border-solid bg-white border-blue-sky justify-between items-center rounded-lg p-3 cursor-pointer" onClick={() => setIsOpen(!isOpen)} >
                <span className='text-textfield-color font-inter text-sm select-none'>{selectedValue}</span>
                <KeyboardArrowDownIcon className='text-slate-400'/>
            </div>
            { isOpen && (
                <div className='flex flex-col rounded-lg p-1.5 bg-white absolute top-full left-0 right-0 mt-2 border border-solid border-blue-sky gap-1'>
                    {valuesToDisplay.map((element, index) => {
                        return (
                            <Cell key={index} onClick={() => handleCellClick(element)}>{element}</Cell>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default TextfieldList;
