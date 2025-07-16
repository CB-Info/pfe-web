import { render, screen } from "@testing-library/react";
import { CustomButton } from "../UI/components/buttons/custom.button";
import { TypeButton, WidthButton } from "../UI/components/buttons/button.types";

test("renders learn react link", () => {
  render(
    <CustomButton
      type={TypeButton.PRIMARY}
      onClick={() => {}}
      width={WidthButton.LARGE}
      isLoading={false}
    >
      Hello World
    </CustomButton>
  );
  const linkElement = screen.getByText(/hello world/i);
  expect(linkElement).toBeInTheDocument();
});
