import { Route, Routes } from "react-router-dom"
import { NavBar } from "./UI/components/navigationBar/navigation.bar"
import HomePage from "./pages/home.page"
import { lightTheme, darkTheme } from './theme';
import { ThemeProvider } from "styled-components";
import { useState } from "react";
import AlertsProvider from "./UI/components/alert/alerts-context";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <AlertsProvider>
        <div className="h-screen w-screen flex">
          <NavBar />
          <Routes>
            <Route path="/home" element={<HomePage />} />
          </Routes>
        </div>
      </AlertsProvider>
    </ThemeProvider>
  )
}

export default App