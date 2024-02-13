import { Route, Routes } from "react-router-dom"
import { NavigationBar } from "./components/navigation.bar"

function App() {
  return (
    <div className="h-screen w-screen flex">
      <NavigationBar/>
      <Routes>
        <Route path="/home"  element={<div>home</div>}/>
      </Routes>
    </div>
  )
}

export default App