import LandingPage from './pages/LandingPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashBoard from './pages/DashBoard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/workspace/:workspaceCode" element={<DashBoard/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App