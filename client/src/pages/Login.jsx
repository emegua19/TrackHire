import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, BriefcaseBusiness } from "lucide-react";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.warning("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.warning("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Success toast
      toast.success("Account created successfully! 🎉");
      toast.info("Please login with your credentials");
      
      // Redirect to login after short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      
      if (errorMessage.includes("already exists")) {
        toast.error("Email already registered. Please login instead.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#16394A]">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/20 z-0" />

      {/* Background Blur Shapes */}
      <div className="absolute inset-0 flex items-center justify-center z-0 opacity-70">
        <div className="relative w-[500px] h-[500px]">
          <div className="absolute top-10 left-20 w-40 h-40 bg-[#5E7CFF] rounded-3xl blur-sm rotate-12" />
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#94A3B8] rounded-full blur-sm" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#0F172A] rounded-full blur-sm" />
          <div className="absolute bottom-10 right-10 w-36 h-36 bg-[#1E3A34] rounded-full blur-sm" />
          <div className="absolute top-28 left-36 w-56 h-56 bg-[#1E293B] rounded-3xl blur-sm" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-between px-8 lg:px-16">
        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-between h-[85vh] py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-md">
              <BriefcaseBusiness className="text-white w-5 h-5" />
            </div>
            <h1 className="text-white text-2xl font-semibold">TrackHire</h1>
          </div>

          <div>
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-emerald-500 text-white text-xs font-semibold tracking-wide mb-6">
              JOB APPLICATION TRACKER
            </div>
            <h2 className="text-white text-6xl font-bold leading-[1.1] max-w-xl">
              Start tracking your career journey
            </h2>
          </div>

          <div className="flex items-center gap-4 text-sm text-white/70">
            <span>© 2024 TrackHire</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>

        {/* Register Card */}
        <div className="w-full max-w-[420px] mx-auto lg:mx-0">
          <div className="bg-[#D9D9D9]/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
            <div className="mb-8">
              <h2 className="text-[38px] font-bold text-[#111827] leading-tight">
                Create account
              </h2>
              <p className="text-gray-600 mt-1 text-sm">
                Join TrackHire to track your applications.
              </p>
            </div>

            {error && (
              <div className="mb-4 bg-red-100 border border-red-300 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full h-[48px] px-5 rounded-full bg-white/80 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@university.edu"
                  required
                  className="w-full h-[48px] px-5 rounded-full bg-white/80 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    required
                    className="w-full h-[48px] px-5 rounded-full bg-white/80 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  required
                  className="w-full h-[48px] px-5 rounded-full bg-white/80 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[50px] rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium transition-all duration-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Register"}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600 mt-8">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;