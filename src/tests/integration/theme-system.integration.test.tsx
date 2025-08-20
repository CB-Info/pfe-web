import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ThemeProvider } from "../../contexts/theme.context";
import { useTheme } from "../../hooks/useTheme";
import { ReactNode } from "react";

// Composant de test pour utiliser le hook useTheme
const TestComponent = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div>
      <div data-testid="theme-mode">{isDarkMode ? "dark" : "light"}</div>
      <button onClick={toggleTheme} data-testid="toggle-theme">
        Toggle Theme
      </button>
      <div
        data-testid="themed-element"
        style={{
          backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
          color: isDarkMode ? "#ffffff" : "#000000",
        }}
      >
        Themed Content
      </div>
    </div>
  );
};

const TestWrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe("Theme System Integration", () => {
  it("should start with light theme by default", () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId("theme-mode")).toHaveTextContent("light");

    const themedElement = screen.getByTestId("themed-element");
    expect(themedElement).toHaveStyle({
      backgroundColor: "#ffffff",
      color: "#000000",
    });
  });

  it("should toggle theme correctly", () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    // État initial
    expect(screen.getByTestId("theme-mode")).toHaveTextContent("light");

    // Basculer vers le mode sombre
    fireEvent.click(screen.getByTestId("toggle-theme"));
    expect(screen.getByTestId("theme-mode")).toHaveTextContent("dark");

    const themedElement = screen.getByTestId("themed-element");
    expect(themedElement).toHaveStyle({
      backgroundColor: "#1a1a1a",
      color: "#ffffff",
    });

    // Basculer vers le mode clair
    fireEvent.click(screen.getByTestId("toggle-theme"));
    expect(screen.getByTestId("theme-mode")).toHaveTextContent("light");
  });

  it("should maintain theme state across multiple toggles", () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    const toggleButton = screen.getByTestId("toggle-theme");
    const themeMode = screen.getByTestId("theme-mode");

    // Série de basculements
    expect(themeMode).toHaveTextContent("light");

    fireEvent.click(toggleButton);
    expect(themeMode).toHaveTextContent("dark");

    fireEvent.click(toggleButton);
    expect(themeMode).toHaveTextContent("light");

    fireEvent.click(toggleButton);
    expect(themeMode).toHaveTextContent("dark");

    fireEvent.click(toggleButton);
    expect(themeMode).toHaveTextContent("light");
  });
});
