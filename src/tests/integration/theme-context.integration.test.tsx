import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ThemeProvider } from "../../contexts/theme.context";
import { useTheme } from "../../hooks/useTheme";
import { ReactNode } from "react";

// Composant simple qui utilise le thème
const ThemedComponent = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div data-testid="themed-app">
      <div data-testid="theme-indicator">
        Mode: {isDarkMode ? "dark" : "light"}
      </div>
      <button onClick={toggleTheme} data-testid="theme-toggle">
        Changer de thème
      </button>
      <div
        data-testid="styled-content"
        style={{
          backgroundColor: isDarkMode ? "#333" : "#fff",
          color: isDarkMode ? "#fff" : "#000",
        }}
      >
        Contenu thématique
      </div>
    </div>
  );
};

// Wrapper avec le provider
const TestWrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe("Theme Context Integration", () => {
  it("should render with light theme by default", () => {
    render(
      <TestWrapper>
        <ThemedComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId("theme-indicator")).toHaveTextContent(
      "Mode: light"
    );

    const styledContent = screen.getByTestId("styled-content");
    expect(styledContent).toHaveStyle({
      backgroundColor: "#fff",
      color: "#000",
    });
  });

  it("should toggle theme when button is clicked", () => {
    render(
      <TestWrapper>
        <ThemedComponent />
      </TestWrapper>
    );

    const themeIndicator = screen.getByTestId("theme-indicator");
    const toggleButton = screen.getByTestId("theme-toggle");
    const styledContent = screen.getByTestId("styled-content");

    // État initial
    expect(themeIndicator).toHaveTextContent("Mode: light");

    // Cliquer pour passer en mode sombre
    fireEvent.click(toggleButton);
    expect(themeIndicator).toHaveTextContent("Mode: dark");
    expect(styledContent).toHaveStyle({
      backgroundColor: "#333",
      color: "#fff",
    });

    // Cliquer pour revenir en mode clair
    fireEvent.click(toggleButton);
    expect(themeIndicator).toHaveTextContent("Mode: light");
    expect(styledContent).toHaveStyle({
      backgroundColor: "#fff",
      color: "#000",
    });
  });

  it("should maintain theme state across multiple components", () => {
    const SecondComponent = () => {
      const { isDarkMode } = useTheme();
      return (
        <div data-testid="second-component">
          Second: {isDarkMode ? "dark" : "light"}
        </div>
      );
    };

    render(
      <TestWrapper>
        <ThemedComponent />
        <SecondComponent />
      </TestWrapper>
    );

    const toggleButton = screen.getByTestId("theme-toggle");
    const firstIndicator = screen.getByTestId("theme-indicator");
    const secondIndicator = screen.getByTestId("second-component");

    // États initiaux
    expect(firstIndicator).toHaveTextContent("Mode: light");
    expect(secondIndicator).toHaveTextContent("Second: light");

    // Changer le thème depuis le premier composant
    fireEvent.click(toggleButton);

    // Les deux composants doivent refléter le changement
    expect(firstIndicator).toHaveTextContent("Mode: dark");
    expect(secondIndicator).toHaveTextContent("Second: dark");
  });
});
