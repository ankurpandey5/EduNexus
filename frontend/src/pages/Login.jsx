import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { GraduationCap, Eye, EyeOff } from "lucide-react";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("student"); // NEW: State to track role
  const navigate = useNavigate(); // Hook to handle navigation

  const handleLogin = (e) => {
    e.preventDefault();
    // Redirects to the dashboard based on the selected role
    if (selectedRole === "student") {
      navigate("/student");
    } else if (selectedRole === "teacher") {
      navigate("/teacher");
    } else if (selectedRole === "admin") {
      navigate("/admin");
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-white">
      
      {/* Left Side - Matching Front Page Gradient and Glow */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-r from-blue-700 to-teal-700 flex-col justify-center items-center p-12 text-center relative overflow-hidden">
        
        {/* Pulsing Glow Effect from Front Page */}
        <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-teal-400 opacity-20 blur-3xl animate-pulse z-0"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <Link to="/" className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mb-6 shadow-xl hover:scale-105 transition-transform cursor-pointer">
            <GraduationCap className="w-8 h-8 text-white" />
          </Link>
          
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Welcome back to <span className="text-orange-500">EduVexa</span>
          </h1>
          
          <p className="text-blue-100 text-lg max-w-xs font-light">
            Pick up exactly where you left off.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
          <p className="text-gray-500 mb-6 text-sm">Please enter your details to access your account.</p>

          {/* NEW: Role Selection Tabs for Testing */}
          <div className="flex p-1 bg-gray-100 rounded-xl mb-6 text-xs font-bold uppercase tracking-wider">
            <button 
              type="button"
              onClick={() => setSelectedRole("student")}
              className={`flex-1 py-2 rounded-lg transition ${selectedRole === "student" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >Student</button>
            <button 
              type="button"
              onClick={() => setSelectedRole("teacher")}
              className={`flex-1 py-2 rounded-lg transition ${selectedRole === "teacher" ? "bg-white text-teal-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >Teacher</button>
            <button 
              type="button"
              onClick={() => setSelectedRole("admin")}
              className={`flex-1 py-2 rounded-lg transition ${selectedRole === "admin" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >Admin</button>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Email</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition pr-12"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm mt-2">
              <label className="flex items-center text-gray-600 cursor-pointer">
                <input type="checkbox" className="mr-2 rounded text-teal-600 focus:ring-teal-500 w-4 h-4 border-gray-300" />
                Remember for 30 days
              </label>
              <a href="#" className="text-teal-600 font-semibold hover:text-teal-800 transition">Forgot password?</a>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-[#1b9a96] hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl transition shadow-md mt-6"
            >
              Sign In as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
            </button>
          </form>

          {/* Bottom Link */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account? <Link to="/register" className="text-teal-600 font-bold hover:text-teal-700 transition">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;