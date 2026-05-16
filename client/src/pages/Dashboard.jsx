import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Calendar,
  ArrowRight,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
} from "lucide-react";

import api from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();

  // Stats
  const [stats, setStats] = useState({
    totalApplications: 0,
    interviewing: 0,
    accepted: 0,
    rejected: 0,
  });

  // Data
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Logged User
  const [user, setUser] = useState(null);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Dropdown
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch Dashboard Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Get token
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch logged user
        try {
          const userRes = await api.get("/auth/me");
          setUser(userRes.data);
          console.log("User data:", userRes.data);
        } catch (userErr) {
          console.error("Failed to fetch user:", userErr);
        }

        // Fetch applications from database
        const appsRes = await api.get("/applications");
        const applications = appsRes.data;
        
        console.log("=== DATABASE DATA ===");
        console.log("Raw applications from DB:", applications);
        console.log("Number of applications:", applications.length);
        
        if (applications.length > 0) {
          console.log("First application structure:", applications[0]);
          console.log("Status values in DB:", applications.map(a => a.status));
        }

        // Calculate stats
        const total = applications.length;

        const interviewing = applications.filter((app) => {
          const status = app.status?.toLowerCase();
          return status === "interview" || 
                 status === "interviewing" || 
                 status === "interview scheduled";
        }).length;

        const accepted = applications.filter((app) => {
          const status = app.status?.toLowerCase();
          return status === "accepted" || 
                 status === "offered" || 
                 status === "hired" || 
                 status === "offer";
        }).length;

        const rejected = applications.filter((app) => {
          const status = app.status?.toLowerCase();
          return status === "rejected";
        }).length;

        setStats({
          totalApplications: total,
          interviewing,
          accepted,
          rejected,
        });

        // Recent Applications (last 5 by date)
        const recent = [...applications]
          .sort((a, b) => {
            const dateA = a.applicationDate ? new Date(a.applicationDate) : new Date(0);
            const dateB = b.applicationDate ? new Date(b.applicationDate) : new Date(0);
            return dateB - dateA;
          })
          .slice(0, 5);

        setRecentApplications(recent);
        console.log("Recent applications (first 5):", recent);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        console.error("Error details:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Status Colors
  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "interview" || s === "interviewing" || s === "interview scheduled") 
      return "bg-purple-100 text-purple-700";
    if (s === "accepted" || s === "offered" || s === "hired" || s === "offer") 
      return "bg-emerald-100 text-emerald-700";
    if (s === "rejected") 
      return "bg-red-100 text-red-700";
    if (s === "applied") 
      return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  // Avatar Initial
  const getInitial = (name) => name?.charAt(0).toUpperCase() || "?";

  // Search Filter - Filter ALL recent applications (not just filtered)
  const filteredApplications = recentApplications.filter((app) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      (app.company?.toLowerCase() || "").includes(search) ||
      (app.position?.toLowerCase() || "").includes(search) ||
      (app.status?.toLowerCase() || "").includes(search)
    );
  });

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/30 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Left */}
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30">
              <span className="text-xl font-bold text-white">T</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">TrackHire</h1>
          </div>

          {/* Search Desktop */}
          <div className="mx-8 hidden max-w-xl flex-1 md:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-lg font-medium text-white">
                  {user?.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "U"}
                </div>
                <div className="hidden text-left md:block">
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <p className="-mt-0.5 text-xs text-gray-500">Job Seeker</p>
                </div>
                <div className="text-sm text-gray-400">▼</div>
              </button>

              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
                  <div className="absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-2xl border border-white/30 bg-white/70 shadow-xl backdrop-blur-2xl">
                    <button onClick={() => navigate("/profile")} className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-gray-700 transition-all hover:bg-white/60">
                      <User size={16} /> Profile
                    </button>
                    <button onClick={() => navigate("/settings")} className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-gray-700 transition-all hover:bg-white/60">
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
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search applications..."
              className="w-full rounded-2xl border border-white/40 bg-white/60 py-3 pl-11 pr-4 text-sm backdrop-blur-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl p-6">
        {/* Greeting */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              {getGreeting()}, {user?.name?.split(" ")[0] || "User"} 👋
            </h1>
            <p className="mt-1 text-gray-600">
              Here's what's happening with your job applications today.
            </p>
          </div>
          <button
            onClick={() => navigate("/applications/add")}
            className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700"
          >
            <Plus size={20} />
            New Application
          </button>
        </div>

        {/* Stats Cards */}
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Total Applications</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">📊</div>
            </div>
            <p className="mt-4 text-4xl font-bold">{stats.totalApplications}</p>
            <p className="mt-1 text-sm text-emerald-600">Total applications</p>
          </div>

          <div className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Interviewing</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">💬</div>
            </div>
            <p className="mt-4 text-4xl font-bold">{stats.interviewing}</p>
            <p className="mt-1 text-sm text-emerald-600">Active interviews</p>
          </div>

          <div className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Accepted</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">🎉</div>
            </div>
            <p className="mt-4 text-4xl font-bold text-emerald-600">{stats.accepted}</p>
            <p className="mt-1 text-sm text-emerald-600">Congratulations!</p>
          </div>

          <div className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Rejected</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-100 text-red-600">😔</div>
            </div>
            <p className="mt-4 text-4xl font-bold text-red-600">{stats.rejected}</p>
            <p className="mt-1 text-sm text-red-500">Keep going</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
          {/* Recent Applications */}
          <div className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-sm backdrop-blur-xl lg:col-span-4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Applications</h2>
              <button onClick={() => navigate("/applications")} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                View All <ArrowRight size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="py-8 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                  <p className="mt-2 text-gray-500">Loading applications...</p>
                </div>
              ) : filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => navigate(`/applications/edit/${app.id}`)}
                    className="flex cursor-pointer items-center justify-between rounded-2xl p-4 transition-all hover:bg-white/60"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl font-semibold text-white ${
                        ["bg-blue-600", "bg-emerald-600", "bg-purple-600", "bg-rose-600"][(app.company?.length || 0) % 4]
                      }`}>
                        {getInitial(app.company)}
                      </div>
                      <div>
                        <p className="font-medium">{app.position}</p>
                        <p className="text-sm text-gray-500">{app.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block rounded-full px-4 py-1 text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status || "Applied"}
                      </span>
                      <p className="mt-1 text-xs text-gray-500">
                        {app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <div className="text-6xl mb-3">📭</div>
                  <p className="text-gray-500">
                    {searchTerm ? "No matching applications found." : "No applications yet. Add your first one!"}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => navigate("/applications/add")}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                    >
                      <Plus size={16} /> Add Application
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

         {/* Right Column - Actionable Version */}
<div className="space-y-6 lg:col-span-3">
  
  {/* Application Status - Interactive Cards */}
  <div className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-sm backdrop-blur-xl">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold">Application Status</h2>
      <button 
        onClick={() => navigate("/applications")}
        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
      >
        View All →
      </button>
    </div>
    
    {/* Clickable Status Cards */}
    <div className="space-y-3">
      {/* Applied Card - Clickable */}
      <div 
        onClick={() => navigate("/applications?status=Applied")}
        className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-50/50 to-transparent hover:from-blue-100/50 cursor-pointer transition-all hover:scale-[1.02]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <span className="text-xl">📝</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">Applied</p>
            <p className="text-xs text-gray-500">Awaiting response</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">
            {stats.totalApplications - stats.interviewing - stats.accepted - stats.rejected}
          </p>
          <p className="text-xs text-gray-500">applications</p>
        </div>
      </div>

      {/* Interviewing Card - Clickable */}
      <div 
        onClick={() => navigate("/applications?status=Interviewing")}
        className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-purple-50/50 to-transparent hover:from-purple-100/50 cursor-pointer transition-all hover:scale-[1.02]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-all">
            <span className="text-xl">🎯</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">Interviewing</p>
            <p className="text-xs text-gray-500">In progress</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-purple-600">{stats.interviewing}</p>
          <p className="text-xs text-gray-500">interviews</p>
        </div>
      </div>

      {/* Accepted Card - Clickable */}
      <div 
        onClick={() => navigate("/applications?status=Offered")}
        className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-50/50 to-transparent hover:from-emerald-100/50 cursor-pointer transition-all hover:scale-[1.02]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-all">
            <span className="text-xl">🎉</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">Accepted</p>
            <p className="text-xs text-gray-500">Offers received</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-emerald-600">{stats.accepted}</p>
          <p className="text-xs text-gray-500">offers</p>
        </div>
      </div>

      {/* Rejected Card - Clickable */}
      <div 
        onClick={() => navigate("/applications?status=Rejected")}
        className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-red-50/50 to-transparent hover:from-red-100/50 cursor-pointer transition-all hover:scale-[1.02]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-all">
            <span className="text-xl">💪</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">Rejected</p>
            <p className="text-xs text-gray-500">Keep going</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
          <p className="text-xs text-gray-500">rejections</p>
        </div>
      </div>
    </div>

    {/* Success Rate Bar */}
    {stats.totalApplications > 0 && (
      <div className="mt-6 pt-4 border-t border-gray-200/60">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Success Rate</span>
          <span className="font-semibold text-emerald-600">
            {Math.round((stats.accepted / stats.totalApplications) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${(stats.accepted / stats.totalApplications) * 100}%` }}
          />
        </div>
      </div>
    )}
  </div>

  {/* Upcoming Interviews - Actionable */}
  <div className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-sm backdrop-blur-xl">
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-xl font-semibold">Upcoming Interviews</h2>
      <Calendar className="text-gray-400" size={20} />
    </div>

    {/* If there are interviews - Show real data */}
    {stats.interviewing > 0 ? (
      <div className="space-y-3">
        {/* This would be populated from actual interview data */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50/50">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-lg">📅</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">Interview Scheduled</p>
            <p className="text-xs text-gray-500">You have {stats.interviewing} upcoming interview(s)</p>
          </div>
          <button 
            onClick={() => navigate("/applications?status=Interviewing")}
            className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all"
          >
            View
          </button>
        </div>
      </div>
    ) : (
      /* Empty State - Actionable */
      <div className="rounded-2xl border-2 border-dashed border-gray-300 py-10 text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
          <Calendar size={32} className="text-gray-400" />
        </div>
        <p className="text-gray-600 font-medium">No interviews scheduled</p>
        <p className="text-sm text-gray-400 mt-1">Update application status when you get an interview</p>
        <button 
          onClick={() => navigate("/applications")}
          className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all inline-flex items-center gap-2"
        >
          View Applications
          <ArrowRight size={14} />
        </button>
      </div>
    )}

    {/* Quick Action Button */}
    <button 
      onClick={() => navigate("/applications/add")}
      className="mt-4 w-full rounded-2xl py-3 font-medium text-blue-600 transition-all hover:bg-blue-50 flex items-center justify-center gap-2"
    >
      <Plus size={18} />
      Add New Application
    </button>
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;