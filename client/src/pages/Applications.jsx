import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  Plus, Search, Edit2, Trash2, RefreshCw, 
  Bell, User, Settings, LogOut, ArrowLeft 
} from "lucide-react";

import api from "../services/api";

const Applications = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch current user
  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }, []);

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get("/applications");
      console.log("✅ Fetched applications:", response.data);
      
      // Debug: Log first item to see available fields
      if (response.data && response.data.length > 0) {
        console.log("First application data:", response.data[0]);
        console.log("Available ID fields:", {
          id: response.data[0].id,
          uuid: response.data[0].uuid,
          _id: response.data[0]._id,
          applicationId: response.data[0].applicationId
        });
      }
      
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setError("Failed to load applications. Please try again.");
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([fetchCurrentUser(), fetchApplications()]);
    };

    loadInitialData();
  }, [fetchCurrentUser, fetchApplications]);

  const handleDelete = async (id) => {
    if (!id) {
      toast.error("Invalid application ID");
      return;
    }
    
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    
    try {
      await api.delete(`/applications/${id}`);
      toast.success("Application deleted successfully!");
      fetchApplications();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete application");
    }
  };

  // Search and Filter
  const filteredApplications = applications
    .filter((app) => {
      const term = searchTerm.toLowerCase().trim();
      if (!term) return true;
      return (
        app.company?.toLowerCase().includes(term) ||
        app.position?.toLowerCase().includes(term)
      );
    })
    .filter((app) => {
      return statusFilter === "All" || 
             app.status?.toLowerCase() === statusFilter.toLowerCase();
    })
    .sort((a, b) => new Date(b.applicationDate || b.createdAt) - new Date(a.applicationDate || a.createdAt));

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "applied": return "bg-blue-100 text-blue-700";
      case "interview":
      case "interviewing": return "bg-purple-100 text-purple-700";
      case "offered":
      case "offer":
      case "accepted": return "bg-emerald-100 text-emerald-700";
      case "rejected": return "bg-red-100 text-red-700";
      case "ghosted": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getInitial = (company) => company?.charAt(0).toUpperCase() || "?";
  
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
    toast.info("Logged out successfully");
    navigate("/login");
  };

  // Helper function to get application ID (handles different possible field names)
  const getAppId = (app) => {
    return app.id || app.uuid || app._id || app.applicationId;
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      {/* Modern Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/30 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Left - Logo & Back Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100 text-gray-600 transition-all hover:bg-gray-200"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30">
              <span className="text-xl font-bold text-white">T</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">TrackHire</h1>
              <p className="-mt-0.5 text-xs text-gray-500">Applications</p>
            </div>
          </div>

          {/* Search - Desktop */}
          <div className="mx-8 hidden max-w-xl flex-1 md:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  if (value) setSearchParams({ search: value });
                  else setSearchParams({});
                }}
                placeholder="Search applications..."
                className="w-full rounded-2xl border border-white/40 bg-white/60 py-3 pl-11 pr-4 text-sm backdrop-blur-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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

        {/* Mobile Search */}
        <div className="px-6 pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
                if (value) setSearchParams({ search: value });
                else setSearchParams({});
              }}
              placeholder="Search applications..."
              className="w-full rounded-2xl border border-white/40 bg-white/60 py-3 pl-11 pr-4 text-sm backdrop-blur-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">My Applications</h1>
            <p className="text-gray-600 mt-1">Manage and track all your job applications in one place.</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button 
              onClick={fetchApplications} 
              className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-2xl transition-all"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
            <button
              onClick={() => navigate("/applications/add")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-medium transition-all shadow-lg shadow-blue-500/30"
            >
              <Plus size={20} />
              Add New Application
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl">
            {error}
          </div>
        )}

        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {["All", "Applied", "Interviewing", "Offered", "Rejected", "Ghosted"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  statusFilter === status
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-white/60 text-gray-600 hover:bg-white/80 backdrop-blur-sm"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200/60 bg-white/40">
                  <th className="px-6 py-5 text-left text-sm font-medium text-gray-500">COMPANY & ROLE</th>
                  <th className="px-6 py-5 text-left text-sm font-medium text-gray-500">APPLIED DATE</th>
                  <th className="px-6 py-5 text-left text-sm font-medium text-gray-500">STATUS</th>
                  <th className="px-6 py-5 text-left text-sm font-medium text-gray-500">JOB LINK</th>
                  <th className="px-6 py-5 text-center text-sm font-medium text-gray-500">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                      <p className="mt-2 text-gray-500">Loading applications...</p>
                    </td>
                  </tr>
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12">
                      <div className="text-6xl mb-3">📭</div>
                      <p className="text-gray-500">
                        {searchTerm 
                          ? `No matching applications found for "${searchTerm}"`
                          : "No applications yet. Add your first one!"}
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={() => navigate("/applications/add")}
                          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                        >
                          <Plus size={16} /> Add Application
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => {
                    const appId = getAppId(app);
                    console.log("Application ID being used:", appId); // Debug log
                    
                    return (
                      <tr 
                        key={appId} 
                        className="hover:bg-white/40 transition-colors cursor-pointer" 
                        onClick={() => {
                          if (appId) {
                            navigate(`/applications/edit/${appId}`);
                          } else {
                            toast.error("Invalid application ID");
                          }
                        }}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-2xl text-white font-semibold text-lg
                              ${["bg-blue-600", "bg-emerald-600", "bg-purple-600", "bg-rose-600"][(appId?.length || 0) % 4]}`}>
                              {getInitial(app.company)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{app.position}</p>
                              <p className="text-sm text-gray-500">{app.company}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-gray-600">
                          {app.applicationDate 
                            ? new Date(app.applicationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                            : "N/A"}
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex px-4 py-1.5 text-sm font-medium rounded-full ${getStatusColor(app.status)}`}>
                            {app.status || "Applied"}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          {app.jobLink ? (
                            <a 
                              href={app.jobLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-blue-600 hover:text-blue-800 text-sm truncate max-w-[200px] inline-block"
                            >
                              View Job →
                            </a>
                          ) : (
                            <span className="text-gray-400 text-sm">No link</span>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center gap-3">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (appId) {
                                  navigate(`/applications/edit/${appId}`);
                                } else {
                                  toast.error("Invalid application ID");
                                }
                              }} 
                              className="p-2 text-gray-400 hover:text-amber-600 rounded-xl transition-all hover:bg-amber-50"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (appId) {
                                  handleDelete(appId);
                                } else {
                                  toast.error("Invalid application ID");
                                }
                              }} 
                              className="p-2 text-gray-400 hover:text-red-600 rounded-xl transition-all hover:bg-red-50"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Summary */}
        {!loading && filteredApplications.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Showing {filteredApplications.length} of {applications.length} applications
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;