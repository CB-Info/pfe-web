import React, { ChangeEvent } from 'react';
import styled, { css } from "styled-components"
import tw from 'twin.macro'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

interface SearchInputProps {
    label: string,
    error: boolean,
    disabled?: boolean,
    name: string,
    value: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
}

const Input = styled.input(({ theme }) => [
    // Appliquez d'abord les styles Tailwind fixes via tw
    tw`
          text-sm
          grow
          font-inter
          p-3
          w-full
          rounded-lg
          border
          flex-1
          gap-1
        `,
    // Ensuite, ajoutez les styles dynamiques basés sur le thème ou les props
    css`
          border-color: ${theme.borderColor};
        `,
]);

export const SearchInput: React.FC<SearchInputProps> = ({ label, value, onChange }) => {

    return (
        <label className="flex flex-col">
            <div className="mb-2">
                <span className="text-primary-color text-sm font-inter">{label}</span>
            </div>
            <div className="relative flex items-center">
                <Input type="text" onChange={onChange} value={value} />
                <button type="submit" className="absolute top-0 end-0 p-2.5 h-full text-sm font-medium text-slate-400 bg-slate-100 rounded-e-lg border border-primary-color hover:bg-slate-200 focus:outline-none">
                <SearchRoundedIcon className="w-4 h-4 opacity-70" />
                </button>
            </div>
        </label>
    );
};