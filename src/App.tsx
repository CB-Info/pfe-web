import { Route, Routes } from "react-router-dom";
import { Suspense, lazy, useState, useCallback } from "react";
import { NavBar } from "./UI/components/navigation/NavBar";
const DashboardPage = lazy(() => import("./UI/pages/dashboard/dashboard.page"));
const DishesPage = lazy(() => import("./UI/pages/dishes/dishes.page"));
const CardsPage = lazy(() => import("./UI/pages/cards/cards.page"));
const OrdersPage = lazy(() => import("./UI/pages/orders/orders.page"));
const KitchenOrdersPage = lazy(
  () => import("./UI/pages/kitchen/kitchen-orders.page")
);
// CustomerMenuPage sera utilisé dans PublicApp.tsx
const QRCodesPage = lazy(() => import("./UI/pages/qr-codes/qr-codes.page"));
const NotFoundPage = lazy(() => import("./UI/pages/NotFoundPage"));
import { lightTheme, darkTheme } from "./applications/theme/theme";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import AlertsProvider from "./contexts/alerts.context";
import AuthProvider from "./contexts/auth.provider";
const SettingsPage = lazy(() => import("./UI/pages/settings/settings.page"));
import { ThemeProvider } from "./contexts/theme.context";
import { useTheme } from "./hooks/useTheme";
import Loading from "./UI/components/common/loading.component";
import { RequireRole } from "./UI/components/guards/RequireRole";

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
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-full">
                    <Loading size="medium" text="Chargement de la page..." />
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route
                    path="/orders"
                    element={
                      <RequireRole
                        allowed={["WAITER", "MANAGER", "OWNER", "ADMIN"]}
                      >
                        <OrdersPage />
                      </RequireRole>
                    }
                  />
                  <Route
                    path="/kitchen"
                    element={
                      <RequireRole
                        allowed={["KITCHEN_STAFF", "MANAGER", "OWNER", "ADMIN"]}
                      >
                        <KitchenOrdersPage />
                      </RequireRole>
                    }
                  />
                  <Route
                    path="/dishes"
                    element={
                      <RequireRole
                        allowed={["KITCHEN_STAFF", "MANAGER", "OWNER", "ADMIN"]}
                      >
                        <DishesPage />
                      </RequireRole>
                    }
                  />
                  <Route
                    path="/cards"
                    element={
                      <RequireRole allowed={["MANAGER", "OWNER", "ADMIN"]}>
                        <CardsPage />
                      </RequireRole>
                    }
                  />
                  <Route
                    path="/qr-codes"
                    element={
                      <RequireRole allowed={["MANAGER", "OWNER", "ADMIN"]}>
                        <QRCodesPage />
                      </RequireRole>
                    }
                  />
                  <Route path="/settings" element={<SettingsPage />} />
                  {/* Redirect old /home route to dashboard */}
                  <Route path="/home" element={<DashboardPage />} />
                  {/* 404 Page */}
                  <Route path="*" element={<NotFoundPage />} />
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
