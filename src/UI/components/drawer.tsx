import { ReactNode } from "react";
import styled, { css } from "styled-components"
import tw from 'twin.macro'

interface ContainerDrawerProps {
    width: number
}

export const ContainerDrawer = styled.div<ContainerDrawerProps>(({ theme, width }) => [
    tw`
        menu
        h-full
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
        <div className="drawer drawer-end">
            <input id={drawerId} type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <div onClick={toggleDrawer}>
                    {defaultChildren}
                </div>
            </div>
            <div className="drawer-side z-50">
                <label htmlFor={drawerId} aria-label="close sidebar" className="drawer-overlay"></label>
                <ContainerDrawer width={width}>
                    {children}
                </ContainerDrawer>
            </div>
        </div>
    )
}

export default Drawer