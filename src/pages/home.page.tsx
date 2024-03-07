import styled, { css } from "styled-components"
import tw from 'twin.macro'

export default function HomePage() {


    const Button = styled.button(({ theme }) => [
        // Appliquez d'abord les styles Tailwind fixes via tw
        tw`
          rounded-sm
          border
          border-blue-500
          text-blue-500
          border-solid
          m-1
          px-4
          py-1
        `,
        // Ensuite, ajoutez les styles dynamiques basés sur le thème ou les props
        css`
          background-color: ${theme.primaryColor};
        `,
      ]);
      
    return (
        <div className="h-screen w-full bg-primary-color bg-opacity-30">
            <span>Home</span>
            <div className="flex">
                <Button>hello</Button>
            </div>
        </div>
    )
}