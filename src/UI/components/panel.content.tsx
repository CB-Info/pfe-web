import styled, { css } from "styled-components"
import tw from 'twin.macro'

export const PanelContent = styled.div(({ theme }) => [
  tw`shadow-sm rounded-lg overflow-hidden`,
  css`background-color: ${theme.panelColor};
  border: 2px solid ${theme.borderColor};
  color: ${theme.textColor}`,
]);
