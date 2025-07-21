import styled, { css } from "styled-components"
import tw from 'twin.macro'

const BorderContainerStyle = styled.div(({ theme }) => [
    tw`
        rounded-2xl
        flex
        flex-1
    `,
    css`
        border: 2px solid ${theme.borderColor}
    `,
]);

export default BorderContainerStyle