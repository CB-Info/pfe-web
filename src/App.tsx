import { Route, Routes } from "react-router-dom"
import { NavBar } from "./UI/components/navigationBar/navigation.bar"
import HomePage from "./pages/home.page"
import { lightTheme, darkTheme } from './theme';
import { ThemeProvider } from "styled-components";
import { useState } from "react";
import AlertsProvider from "./UI/components/alert/alerts-context";
import AuthProvider from "./auth/auth.provider"


function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <AlertsProvider>
        <AuthProvider>
          <div className="h-screen w-screen flex">
            <NavBar />
            <Routes>
              <Route path="/home" element={<HomePage />} />
            </Routes>
          </div>
        </AuthProvider>
      </AlertsProvider>
    </ThemeProvider>
  )
}

export default App