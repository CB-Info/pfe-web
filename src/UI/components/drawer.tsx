import { ReactNode } from "react";
import CustomButton, { TypeButton, WidthButton } from "./custom.button"
import styled, { css } from "styled-components"
import tw from 'twin.macro'

interface ContainerDrawerProps {
    width: number
}

const ContainerDrawer = styled.div<ContainerDrawerProps>(({ theme, width }) => [
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
    children: ReactNode
    width: number
    label: string
}

const DrawerButton: React.FC<DrawerButtonProps> = ({ children, width, label }) => {
    const toggleDrawer = () => {
        const drawerCheckbox = document.getElementById('my-drawer-4') as HTMLInputElement;
        if (drawerCheckbox) {
            drawerCheckbox.checked = !drawerCheckbox.checked;
        }
    };

    return (
        <div className="drawer drawer-end">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <CustomButton 
                    type={TypeButton.PRIMARY} 
                    onClick={toggleDrawer}
                    width={WidthButton.MEDIUM} 
                    isLoading={false}
                >
                    { label }
                </CustomButton>
            </div> 
            <div className="drawer-side">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <ContainerDrawer width={width}>
                    { children }
                </ContainerDrawer>
            </div>
        </div>
    )
}

export default DrawerButton