import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard"; // Added this

function App() {
  return (
    <Router>
      <Routes>
        {/* The Landing Page */}
        <Route path="/" element={<Home />} />
        
        {/* The Login Page */}
        <Route path="/login" element={<Login />} />

        {/* The Registration Page */}
        <Route path="/register" element={<Register />} />

        {/* The Student Dashboard (New Route) */}
        <Route path="/student" element={<StudentDashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;
