import { Route, Routes } from "react-router-dom"
import { NavBar } from "./components/navigationBar/navigation.bar"
import HomePage from "./pages/home.page"

function App() {
  return (
    <div className="h-screen w-screen flex">
      <NavBar/>
      <Routes>
        <Route path="/home"  element={<HomePage/>}/>
      </Routes>
    </div>
  )
}

export default App