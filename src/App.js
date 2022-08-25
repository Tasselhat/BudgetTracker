import { Route, Link, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx";
import "./index.css";
import Homepage from "./Pages/Homepage.jsx";
import TrackerRings from "./BudgetTracker/TrackerRings.jsx";
import Profile from "./Pages/Profile.jsx";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/rings" element={<TrackerRings />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
