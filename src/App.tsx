import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LearnMorePage from "./pages/LearnMorePage";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/learn-more" element={<LearnMorePage />} />
    </Routes>
  );
};

export default App;
