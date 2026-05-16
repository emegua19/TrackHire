import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, BriefcaseBusiness } from "lucide-react";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    if (!formData.email || !formData.password) {
      toast.warning("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", formData);

      localStorage.setItem("token", response.data.token);
      
      // Success toast with user name
      const userName = response.data.user?.name || "User";
      toast.success(`Welcome back, ${userName}! 🎉`);
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Invalid email or password";
      setError(errorMessage);
      
      // Error toast
      if (errorMessage.includes("Invalid")) {
        toast.error("Invalid email or password. Please try again.");
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
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-md">
              <BriefcaseBusiness className="text-white w-5 h-5" />
            </div>

            <h1 className="text-white text-2xl font-semibold">
              TrackHire
            </h1>
          </div>

          {/* Hero Text */}
          <div>
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-emerald-500 text-white text-xs font-semibold tracking-wide mb-6">
              JOB APPLICATION TRACKER
            </div>

            <h2 className="text-white text-6xl font-bold leading-[1.1] max-w-xl">
              Never lose track of your dream job
            </h2>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 text-sm text-white/70">
            <span>© 2024 TrackHire</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-[420px] mx-auto lg:mx-0">
          <div className="bg-[#D9D9D9]/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-[38px] font-bold text-[#111827] leading-tight">
                Welcome back
              </h2>

              <p className="text-gray-600 mt-1 text-sm">
                Please enter your details to sign in.
              </p>
            </div>

            {/* Error - Still keep for fallback */}
            {error && (
              <div className="mb-4 bg-red-100 border border-red-300 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
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
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between text-sm pt-1">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
                  />

                  Remember me
                </label>

                <a
                  href="#"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[50px] rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium transition-all duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            {/* Register */}
            <p className="text-center text-sm text-gray-600 mt-8">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-medium hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;