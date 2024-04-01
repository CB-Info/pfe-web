import styled, { css } from "styled-components"
import tw from 'twin.macro'

const LabelStyle = styled.div(({ theme }) => [
    tw`
        font-inter
        text-sm
        pb-2
        select-none
    `,
    css`
        color: ${theme.textColor};
    `,
]);

export default LabelStyle