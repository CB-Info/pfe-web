import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { lightTheme, darkTheme } from "./applications/theme/theme";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import AlertsProvider from "./contexts/alerts.context";
import { ThemeProvider } from "./contexts/theme.context";
import { useTheme } from "./hooks/useTheme";
import Loading from "./UI/components/common/loading.component";

const CustomerMenuPage = lazy(
  () => import("./UI/pages/customer/customer-menu.page")
);
const NotFoundPage = lazy(() => import("./UI/pages/NotFoundPage"));

const ThemedPublicApp = () => {
  const { isDarkMode } = useTheme();

  return (
    <StyledThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <AlertsProvider>
        <div className="relative h-screen w-screen overflow-hidden">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <Loading size="medium" text="Chargement de la page..." />
              </div>
            }
          >
            <Routes>
              <Route path="/customer/:tableId" element={<CustomerMenuPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
      </AlertsProvider>
    </StyledThemeProvider>
  );
};

function PublicApp() {
  return (
    <ThemeProvider>
      <ThemedPublicApp />
    </ThemeProvider>
  );
}

export default PublicApp;
