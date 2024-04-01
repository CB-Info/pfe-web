import styled, { css } from "styled-components"
import tw from 'twin.macro'

export const BaseContent = styled.div(({ theme }) => [
  tw`w-full h-screen flex flex-col overflow-y-auto`,
  css`background-color: ${theme.mainBg};`,
]);
