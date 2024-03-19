// Styled Components
import styled, { css } from "styled-components"
import tw from 'twin.macro'

export const DotButton = styled.button(({ theme }) => [
    tw`w-min h-min px-2 py-1 rounded text-xs font-normal cursor-pointer`,
    css`
        border: 1px dashed ${theme.badgeColor};
    `
]);

interface CellCLProps {
    isHover?: boolean
}

export const CellCLStyle = styled.div<CellCLProps>(({ theme, isHover = true }) => [
    tw`flex w-full rounded text-sm py-1 items-center gap-1.5 px-2 justify-between`,
    isHover ? tw`cursor-pointer` : ``,
    isHover && css`
        &:hover {
            background-color: ${theme.blue100};
        }
    `,
]);
