import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminPeriods from "./pages/adminPeriods/AdminPeriods"; // Assure-toi que ce composant existe


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/periods" element={<AdminPeriods />} />
      </Routes>
    </Router>
  );
}

export default App;
