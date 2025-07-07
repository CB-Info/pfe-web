import { Route, Routes } from 'react-router-dom';
import { NavBar } from './UI/components/navigationBar/navigation.bar';
import DashboardPage from './UI/pages/dashboard/dashboard.page';
import DishesPage from './UI/pages/dishes/dishes.page';
import CardsPage from './UI/pages/cards/cards.page';
import { lightTheme, darkTheme } from './applications/theme/theme';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import AlertsProvider from './contexts/alerts.context';
import AuthProvider from './contexts/auth.provider';
import SettingsPage from './UI/pages/settings/settings.page';
import { ThemeProvider, useTheme } from './contexts/theme.context';
import { DishFilterProvider } from './contexts/dishFilters.context';

const ThemedApp = () => {
  const { isDarkMode } = useTheme();

  return (
    <StyledThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <AlertsProvider>
        <DishFilterProvider>
          <AuthProvider>
            <div className="h-screen w-screen flex">
              <NavBar />
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dishes" element={<DishesPage />} />
                <Route path="/cards" element={<CardsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                {/* Redirect old /home route to dashboard */}
                <Route path="/home" element={<DashboardPage />} />
              </Routes>
            </div>
          </AuthProvider>
        </DishFilterProvider>
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
