import LandingPage from "./pages/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashBoard from "./pages/DashBoard";
import Call from "./pages/Call";
// import Members from "./components/Members";

function App() {
  // const work = "Zape's Space-0082";
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/member" element={<Members workspaceName={work} />} /> */}
        <Route path="/workspace/:workspaceCode" element={<DashBoard />} />
        <Route path="/call" element={<Call />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
