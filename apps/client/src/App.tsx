import LandingPage from "./pages/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashBoard from "./pages/DashBoard";
import Members from "./components/Members";
import Calendar from "./pages/Calendar";
// import Sprint from './components/Sprint'

function App() {
  const work = "Zape's Space-0082";
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ss" element={<Calendar />} />
        <Route path="/member" element={<Members workspaceName={work} />} />
        <Route path="/workspace/:workspaceCode" element={<DashBoard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
