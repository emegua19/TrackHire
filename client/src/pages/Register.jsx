import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  BriefcaseBusiness,
  Check,
  User,
  Mail,
  Lock,
} from "lucide-react";
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Password Strength
  const getPasswordStrength = (pass) => {
    if (!pass)
      return {
        strength: 0,
        label: "",
      };

    if (pass.length < 6)
      return {
        strength: 33,
        label: "Weak password",
      };

    if (pass.length < 8)
      return {
        strength: 66,
        label: "Medium password",
      };

    return {
      strength: 100,
      label: "Good password",
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
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

      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#071226] relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#0b5d4f_0%,transparent_30%)]" />

      {/* Stripes Overlay */}
      <div className="absolute inset-0 opacity-[0.06] bg-[repeating-linear-gradient(135deg,white_0px,white_2px,transparent_2px,transparent_12px)]" />

      {/* Main Layout */}
      <div className="relative z-10 min-h-screen flex">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex w-1/2 flex-col justify-between px-10 py-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <BriefcaseBusiness className="w-5 h-5 text-white" />
            </div>

            <h1 className="text-white text-2xl font-semibold">
              TrackHire
            </h1>
          </div>

          {/* Hero Content */}
          <div className="max-w-md">
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/20 text-emerald-400 text-xs font-semibold tracking-wide mb-8 backdrop-blur-xl">
              JOIN THE COMMUNITY
            </div>

            <h2 className="text-white text-5xl font-bold leading-tight mb-10">
              Start organizing your job hunt today
            </h2>

            {/* Features */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>

                <span>Track unlimited job applications</span>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>

                <span>Get interview reminders</span>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>

                <span>Organize your resume versions</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 text-sm text-white/60">
            <span>© 2024 TrackHire</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10 bg-[#f5f5f5]">
          {/* Glass Card */}
          <div className="w-full max-w-[430px] rounded-[28px] border border-white/40 bg-white/35 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-8">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-[40px] font-bold text-[#111827] leading-tight">
                Create an account
              </h2>

              <p className="text-gray-500 text-sm mt-2">
                Fill in the details below to get started.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 text-red-600 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Alex Johnson"
                    required
                    className="w-full h-[50px] rounded-2xl bg-[#EEF1F5]/90 border border-gray-200 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex.j@university.edu"
                    required
                    className="w-full h-[50px] rounded-2xl bg-[#EEF1F5]/90 border border-gray-200 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full h-[50px] rounded-2xl bg-[#EEF1F5]/90 border border-gray-200 pl-11 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Strength */}
                {formData.password && (
                  <div className="mt-3">
                    <div className="flex gap-1.5">
                      <div
                        className={`h-1 flex-1 rounded-full ${
                          passwordStrength.strength >= 33
                            ? "bg-emerald-500"
                            : "bg-gray-200"
                        }`}
                      />

                      <div
                        className={`h-1 flex-1 rounded-full ${
                          passwordStrength.strength >= 66
                            ? "bg-emerald-500"
                            : "bg-gray-200"
                        }`}
                      />

                      <div
                        className={`h-1 flex-1 rounded-full ${
                          passwordStrength.strength >= 100
                            ? "bg-emerald-500"
                            : "bg-gray-200"
                        }`}
                      />
                    </div>

                    <p className="text-xs text-emerald-600 font-medium mt-2">
                      {passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full h-[50px] rounded-2xl bg-[#EEF1F5]/90 border border-gray-200 pl-11 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[54px] rounded-2xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 mt-2"
              >
                {loading ? "Creating account..." : "Create Account"}

                {!loading && <span className="text-lg">→</span>}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500 mt-8">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:underline"
              >
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