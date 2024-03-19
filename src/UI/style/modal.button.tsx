import styled, { css } from "styled-components"
import tw from 'twin.macro'

interface ModalButtonProps {
    isErrorColors?: boolean
}

const ModalButton = styled.button<ModalButtonProps>(({ theme, isErrorColors = false }) => [
    tw`
    `,
    css`
        user-select: none;
        transition: background 20ms ease-in 0s;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        border-radius: 4px;
        height: 32px;
        padding-left: 12px;
        padding-right: 12px;
        font-size: 14px;
        line-height: 1.2;
        color: ${isErrorColors ? "rgb(235, 87, 87)": theme.blackColor };
        border: 1px solid ${isErrorColors ? theme.errorColor : "rgba(55, 53, 47, 0.16)"};
        width: 100%;
        margin-top: 8px;
        ${isErrorColors && (`background: rgba(235, 87, 87, 0.1)`)};
    `,
]);

export default ModalButton