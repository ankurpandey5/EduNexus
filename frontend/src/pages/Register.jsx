import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import axios from "axios"; // NEW: Import Axios

function Register() {
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  
  // NEW: State to track user input
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for errors

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      // 1. Send data to your Node.js backend
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      // 2. Get the token and user data back
      const userData = response.data;

      // 3. Save the VIP wristband (token) in the browser
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));

      // 4. Redirect based on the real role
      if (userData.role === "student") {
        navigate("/student");
      } else {
        navigate("/teacher");
      }
    } catch (err) {
      // Show error if email is already taken, etc.
      setError(err.response?.data?.message || "An error occurred during registration.");
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-white">
      
      {/* Left Side */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-r from-blue-700 to-teal-700 flex-col justify-center items-center p-12 text-center relative overflow-hidden">
        <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-teal-400 opacity-20 blur-3xl animate-pulse z-0"></div>
        <div className="relative z-10 flex flex-col items-center">
          <Link to="/" className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mb-6 shadow-xl hover:scale-105 transition-transform cursor-pointer">
            <GraduationCap className="w-8 h-8 text-white" />
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Join <span className="text-orange-500">EduVexa</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-xs font-light">
            Start your personalized learning journey today.
          </p>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create account</h2>
          <p className="text-gray-500 mb-8 text-sm">Fill in your details to get started</p>

          <form className="space-y-5" onSubmit={handleRegister}>
            
            {/* NEW: Error display */}
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                value={name} // NEW: Bind state
                onChange={(e) => setName(e.target.value)} // NEW: Update state
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Email</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={email} // NEW: Bind state
                onChange={(e) => setEmail(e.target.value)} // NEW: Update state
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
                  value={password} // NEW: Bind state
                  onChange={(e) => setPassword(e.target.value)} // NEW: Update state
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

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">I am a</label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${
                    role === "student" 
                      ? "border-teal-500 bg-teal-50 text-teal-700" 
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${
                    role === "teacher" 
                      ? "border-teal-500 bg-teal-50 text-teal-700" 
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  Teacher
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-[#1b9a96] hover:bg-teal-600 text-white font-bold py-3.5 rounded-xl transition shadow-md mt-6"
            >
              Create Account
            </button>
          </form>

          {/* Bottom Link */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-teal-600 font-bold hover:text-teal-700 transition">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;