import styled, { css } from "styled-components"
import tw from 'twin.macro'

const TitleStyle = styled.div(({ theme }) => [
    tw`
        font-inter
        font-semibold
        text-xl
    `,
    css`
        color: ${theme.textColor};
    `,
]);

export default TitleStyle