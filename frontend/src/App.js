import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { HomeUser } from './pages/Home/HomeUser';
import { MaintenancePage } from "./pages/Maintenance";

function App() {
  return (
    <Router>
    <Routes>
      <Route exact path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<HomeUser />} />
      <Route path="/maintenance" element={<MaintenancePage />} />
    </Routes>
  </Router>
  );
}

export default App;
