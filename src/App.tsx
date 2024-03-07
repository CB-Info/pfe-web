import { Route, Routes } from "react-router-dom"
import { NavBar } from "./components/navigationBar/navigation.bar"
import HomePage from "./pages/home.page"
import { lightTheme, darkTheme } from './theme';
import { ThemeProvider } from "styled-components";
import { useState } from "react";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <div className="h-screen w-screen flex">
        <NavBar />
        <Routes>
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App