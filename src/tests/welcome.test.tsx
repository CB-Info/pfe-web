import { render, screen } from "@testing-library/react";
import { CustomButton } from "../UI/components/buttons/custom.button";
import { TypeButton, WidthButton } from "../UI/components/buttons/button.types";
import { vi } from "vitest";

// Mock du composant Loading pour éviter les problèmes avec Lottie dans les tests
vi.mock("../UI/components/common/loading.component", () => ({
  default: ({
    variant = "classic",
    size = "medium",
    text,
  }: {
    variant?: "sandy" | "classic";
    size?: "small" | "medium" | "large";
    text?: string;
  }) => (
    <div
      role="progressbar"
      data-testid="loading-component"
      data-variant={variant}
      data-size={size}
    >
      {text && <span>{text}</span>}
    </div>
  ),
}));

// Mock pour lottie-react
vi.mock("lottie-react", () => ({
  default: ({
    className,
    style,
  }: {
    className?: string;
    style?: React.CSSProperties;
  }) => (
    <div
      role="progressbar"
      className={className}
      style={style}
      data-testid="lottie-animation"
    />
  ),
}));

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
