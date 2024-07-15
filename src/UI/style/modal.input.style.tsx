import styled, { css } from "styled-components"
import tw from 'twin.macro'

interface ModalInputProps {
    type?: 'text' | 'number';
}

const ModalInput = styled.input<ModalInputProps>(() => [
    tw`
        font-inter
    `,
    css`
        display: flex;
        align-items: center;
        width: 100%;
        font-size: 14px;
        line-height: 20px;
        position: relative;
        border-radius: 4px;
        box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px inset;
        background: rgba(242, 241, 238, 0.6);
        cursor: text;
        padding: 3px 6px;
        height: 28px;
        ${({ type }) => type === 'number' && css`
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
         -webkit-appearance: none;
      }
    `}
    `,
]);

export default ModalInput