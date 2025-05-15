import { Route, Routes } from 'react-router-dom';
import { NavBar } from './UI/components/navigationBar/navigation.bar';
import HomePage from './UI/pages/dish/dish.page';
import { lightTheme, darkTheme } from './applications/theme/theme';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import AlertsProvider from './contexts/alerts.context';
import AuthProvider from './contexts/auth.provider';
import SettingsPage from './UI/pages/settings/settings.page';
import { ThemeProvider, useTheme } from './contexts/theme.context'; // Assurez-vous que l'importation est correcte

const ThemedApp = () => {
  const { isDarkMode } = useTheme(); // Utiliser le hook useTheme pour obtenir isDarkMode

  return (
    <StyledThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <AlertsProvider>
        <AuthProvider>
          <div className="h-screen w-screen flex">
            <NavBar />
            <Routes>
              <Route path="/home" element={<HomePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
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
