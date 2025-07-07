import styled, { css } from "styled-components"
import tw from 'twin.macro'

export const BaseContent = styled.div(({ theme }) => [
  tw`w-full h-full flex flex-col relative`,
  css`background-color: ${theme.mainBg};`,
]);
