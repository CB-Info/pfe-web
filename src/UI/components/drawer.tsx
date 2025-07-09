import { ReactNode } from "react";
import styled, { css } from "styled-components"
import tw from 'twin.macro'

interface ContainerDrawerProps {
    width: number
}

export const ContainerDrawer = styled.div<ContainerDrawerProps>(({ theme, width }) => [
    tw`
        bg-white
        shadow-lg
        h-full
        overflow-y-auto
    `,
    css`
        background-color: ${theme.backgroundColor};
        width: ${width}px;
    `,
]);


interface DrawerButtonProps {
    drawerId: string
    defaultChildren: ReactNode
    children: ReactNode
    width: number
}

const Drawer: React.FC<DrawerButtonProps> = ({ children, width, drawerId, defaultChildren }) => {
    const toggleDrawer = () => {
        const drawerCheckbox = document.getElementById(drawerId) as HTMLInputElement;
        if (drawerCheckbox) {
            drawerCheckbox.checked = !drawerCheckbox.checked;
        }
    };

    return (
        <div className="relative">
            <input id={drawerId} type="checkbox" className="hidden" />
            <div className="relative">
                <div onClick={toggleDrawer}>
                    {defaultChildren}
                </div>
            </div>
            <div className="fixed inset-0 z-50 hidden peer-checked:block">
                <label htmlFor={drawerId} aria-label="close sidebar" className="absolute inset-0 bg-black bg-opacity-50"></label>
                <div className="absolute right-0 top-0 h-full">
                    <ContainerDrawer width={width}>
                        {children}
                    </ContainerDrawer>
                </div>
            </div>
        </div>
    )
}

export default Drawer