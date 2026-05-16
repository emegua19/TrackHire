import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Briefcase, MapPin, Link as LinkIcon, Calendar, Clock, DollarSign, 
  X, Check, Bell, User, Settings, LogOut, ArrowLeft, Trash2 
} from "lucide-react";

import api from "../services/api";

const AddApplication = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL for edit mode
  const isEditMode = !!id;

  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    jobLink: "",
    applicationDate: "",
    status: "Applied",
    interviewDate: "",
    salaryMin: "",
    salaryMax: "",
    notes: "",
  });

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch application data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchApplication = async () => {
        try {
          const response = await api.get("/applications");
          const application = response.data.find(app => app.id === parseInt(id));
          
          if (application) {
            setFormData({
              company: application.company || "",
              position: application.position || "",
              jobLink: application.jobLink || "",
              applicationDate: application.applicationDate?.split('T')[0] || "",
              status: application.status || "Applied",
              interviewDate: application.interviewDate?.split('T')[0] || "",
              salaryMin: application.salaryMin || "",
              salaryMax: application.salaryMax || "",
              notes: application.notes || "",
            });
          } else {
            alert("Application not found");
            navigate("/applications");
          }
        } catch (error) {
          console.error("Failed to fetch application:", error);
          alert("Failed to load application data");
        } finally {
          setFetching(false);
        }
      };
      fetchApplication();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        company: formData.company,
        position: formData.position,
        jobLink: formData.jobLink || null,
        applicationDate: formData.applicationDate,
        status: formData.status,
        interviewDate: formData.interviewDate || null,
        notes: formData.notes || null,
      };

      if (isEditMode) {
        await api.put(`/applications/${id}`, payload);
        alert("Application updated successfully!");
      } else {
        await api.post("/applications", payload);
        alert("Application added successfully!");
      }
      
      navigate("/applications");
    } catch (error) {
      console.error(error);
      alert(`Failed to ${isEditMode ? "update" : "add"} application. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    
    try {
      await api.delete(`/applications/${id}`);
      alert("Application deleted successfully!");
      navigate("/applications");
    } catch (error) {
      console.error(error);
      alert("Failed to delete application");
    }
  };

  // Helper functions for user dropdown
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(word => word[0]).join("").slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      "from-blue-500 to-purple-500",
      "from-emerald-500 to-teal-500",
      "from-orange-500 to-red-500",
      "from-pink-500 to-rose-500",
    ];
    const index = (name?.length || 0) % colors.length;
    return colors[index];
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-500">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      {/* Modern Navbar - Same as Dashboard */}
      <nav className="sticky top-0 z-50 border-b border-white/30 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Left - Logo & Back Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/applications")}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100 text-gray-600 transition-all hover:bg-gray-200"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30">
              <span className="text-xl font-bold text-white">T</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">TrackHire</h1>
              <p className="-mt-0.5 text-xs text-gray-500">
                {isEditMode ? "Edit Application" : "Add New"}
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-600 transition-colors hover:text-gray-900">
              <Bell size={22} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 rounded-2xl border border-white/40 bg-white/60 px-3 py-2 backdrop-blur-xl transition-all hover:bg-white/80"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-medium text-white ${getAvatarColor(user?.name)}`}>
                  {getInitials(user?.name)}
                </div>
                <div className="hidden text-left md:block">
                  <p className="text-sm font-medium">{user?.name || "Loading..."}</p>
                  <p className="-mt-0.5 text-xs text-gray-500">Job Seeker</p>
                </div>
                <div className="text-sm text-gray-400">▼</div>
              </button>

              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
                  <div className="absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-2xl border border-white/30 bg-white/70 shadow-xl backdrop-blur-2xl">
                    <div className="border-b border-gray-200/60 px-5 py-3 md:hidden">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-gray-700 transition-all hover:bg-white/60">
                      <User size={16} /> Profile
                    </button>
                    <button className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-gray-700 transition-all hover:bg-white/60">
                      <Settings size={16} /> Settings
                    </button>
                    <div className="h-px bg-gray-200/60"></div>
                    <button onClick={handleLogout} className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-red-600 transition-all hover:bg-red-50/70">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-73px)] p-6">
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl w-full max-w-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-200/60">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {isEditMode ? "Edit Application" : "Add New Application"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isEditMode 
                    ? "Update your application details below." 
                    : "Keep track of your latest opportunity. You can always update this later."}
                </p>
              </div>
              <button 
                onClick={() => navigate("/applications")}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Acme Corp"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
                  />
                </div>
              </div>

              {/* Job Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Job Position <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="e.g. Frontend Engineer"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
                  />
                </div>
              </div>
            </div>

            {/* Job Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Job Link (URL)
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="url"
                  name="jobLink"
                  value={formData.jobLink}
                  onChange={handleChange}
                  placeholder="https://careers.acmecorp.com/jobs/123"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Application Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Application Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="date"
                    name="applicationDate"
                    value={formData.applicationDate}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offered">Offered</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Ghosted">Ghosted</option>
                  <option value="Withdrawn">Withdrawn</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Interview Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Interview Date (Optional)
                </label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="date"
                    name="interviewDate"
                    value={formData.interviewDate}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
                  />
                </div>
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Salary Range (Optional)
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="number"
                      name="salaryMin"
                      value={formData.salaryMin}
                      onChange={handleChange}
                      placeholder="Min"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
                    />
                  </div>
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="number"
                      name="salaryMax"
                      value={formData.salaryMax}
                      onChange={handleChange}
                      placeholder="Max"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any details about the role, recruiter names, or requirements here..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y bg-white/80"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between gap-4 pt-6">
              <div>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-6 py-3 text-red-600 font-medium hover:bg-red-50 rounded-2xl transition-all"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/applications")}
                  className="px-8 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-8 py-3 rounded-2xl transition-all shadow-lg shadow-blue-500/30"
                >
                  <Check size={20} />
                  {loading ? "Saving..." : (isEditMode ? "Update" : "Save")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddApplication;