import styled, { css } from "styled-components"
import tw from 'twin.macro'

const TitleStyle = styled.h2(({ theme }) => [
    tw`
        font-inter
        font-semibold
        text-xl
        m-0
    `,
    css`
        color: ${theme.textColor};
    `,
]);

export default TitleStyle