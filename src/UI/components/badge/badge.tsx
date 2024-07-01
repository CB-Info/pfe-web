import styled, { css } from "styled-components"
import tw from 'twin.macro'

interface BadgeContainerProps {
}

const BadgeContainer = styled.div<BadgeContainerProps>(({ theme }) => [
    tw`
        w-min
        h-min
        px-2
        py-1
        rounded
        font-inter
        text-xs
        font-normal
        cursor-default
        truncate
    `,
    css`
        color: ${theme.buttonText};
        background-color: ${theme.badgeColor}
    `,
]);

interface BadgeProps {
    label: string
}

export const Badge: React.FC<BadgeProps> = ({ label }) => {
    return (
        <BadgeContainer>
            <span>{label}</span>
        </BadgeContainer>
    )
}

export default Badge