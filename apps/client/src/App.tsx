import LandingPage from "./pages/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashBoard from "./pages/DashBoard";
import Call from "./pages/Call";
import SSOCallback from "./pages/SSOCallback";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/workspace/:workspaceCode" element={<DashBoard />} />
        <Route path="/call" element={<Call />} />
        <Route path="/sso-callback" element={<SSOCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
