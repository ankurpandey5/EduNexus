import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard"; // Import the Teacher Dashboard

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

        {/* The Student Dashboard */}
        <Route path="/student" element={<StudentDashboard />} />

        {/* The Teacher Dashboard (New Route) */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;
