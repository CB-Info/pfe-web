import styled, { css } from "styled-components"
import tw from 'twin.macro'

export const BaseContent = styled.div(({ theme }) => [
  tw`w-full h-screen flex flex-col`,
  css`background-color: ${theme.mainBg};
  color: ${theme.textColor};`,
]);
