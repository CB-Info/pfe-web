import { Route, Routes } from "react-router-dom";
import { Suspense, lazy, useState, useCallback } from "react";
import { NavBar } from "./UI/components/navigation/NavBar";
// Replace static imports with lazy imports
const DashboardPage = lazy(() => import("./UI/pages/dashboard/dashboard.page"));
const DishesPage = lazy(() => import("./UI/pages/dishes/dishes.page"));
const CardsPage = lazy(() => import("./UI/pages/cards/cards.page"));
import { lightTheme, darkTheme } from "./applications/theme/theme";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import AlertsProvider from "./contexts/alerts.context";
import AuthProvider from "./contexts/auth.provider";
const SettingsPage = lazy(() => import("./UI/pages/settings/settings.page"));
import { ThemeProvider, useTheme } from "./contexts/theme.context";

const ThemedApp = () => {
  const { isDarkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  return (
    <StyledThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <AlertsProvider>
        <AuthProvider>
          <div className="relative h-screen w-screen flex overflow-hidden">
            <NavBar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <button
              aria-label="Ouvrir le menu"
              onClick={toggleSidebar}
              className="md:hidden p-2 absolute top-4 left-4 z-50 rounded bg-white text-gray-800 focus:outline-none focus:ring"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
                onClick={closeSidebar}
                aria-hidden="true"
              />
            )}
            <div className="flex-1 overflow-auto">
              <Suspense fallback={<div className="flex items-center justify-center h-full">Chargement...</div>}>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/dishes" element={<DishesPage />} />
                  <Route path="/cards" element={<CardsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  {/* Redirect old /home route to dashboard */}
                  <Route path="/home" element={<DashboardPage />} />
                </Routes>
              </Suspense>
            </div>
          </div>
        </AuthProvider>
      </AlertsProvider>
    </StyledThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

export default App;
