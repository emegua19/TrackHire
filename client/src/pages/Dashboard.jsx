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
          console.log(
            "Status values in DB:",
            applications.map((a) => a.status),
          );
        }

        // Calculate stats
        const total = applications.length;

        const interviewing = applications.filter((app) => {
          const status = app.status?.toLowerCase();
          return (
            status === "interview" ||
            status === "interviewing" ||
            status === "interview scheduled"
          );
        }).length;

        const accepted = applications.filter((app) => {
          const status = app.status?.toLowerCase();
          return (
            status === "accepted" ||
            status === "offered" ||
            status === "hired" ||
            status === "offer"
          );
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
            const dateA = a.applicationDate
              ? new Date(a.applicationDate)
              : new Date(0);
            const dateB = b.applicationDate
              ? new Date(b.applicationDate)
              : new Date(0);
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
    if (
      s === "interview" ||
      s === "interviewing" ||
      s === "interview scheduled"
    )
      return "bg-purple-100 text-purple-700";
    if (s === "accepted" || s === "offered" || s === "hired" || s === "offer")
      return "bg-emerald-100 text-emerald-700";
    if (s === "rejected") return "bg-red-100 text-red-700";
    if (s === "applied") return "bg-blue-100 text-blue-700";
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
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
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
                  {user?.name
                    ?.split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "U"}
                </div>
                <div className="hidden text-left md:block">
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <p className="-mt-0.5 text-xs text-gray-500">Job Seeker</p>
                </div>
                <div className="text-sm text-gray-400">▼</div>
              </button>

              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                  ></div>
                  <div className="absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-2xl border border-white/30 bg-white shadow-xl backdrop-blur-2xl">
                    <button
                      onClick={() => navigate("/profile")}
                      className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-gray-700 transition-all hover:bg-white/60"
                    >
                      <User size={16} /> Profile
                    </button>
                    <button
                      onClick={() => navigate("/settings")}
                      className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-gray-700 transition-all hover:bg-white/60"
                    >
                      <Settings size={16} /> Settings
                    </button>
                    <div className="h-px bg-gray-200/60"></div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-red-600 transition-all hover:bg-red-50/70"
                    >
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
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
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
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                📊
              </div>
            </div>
            <p className="mt-4 text-4xl font-bold">{stats.totalApplications}</p>
            <p className="mt-1 text-sm text-emerald-600">Total applications</p>
          </div>

          <div className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Interviewing</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                💬
              </div>
            </div>
            <p className="mt-4 text-4xl font-bold">{stats.interviewing}</p>
            <p className="mt-1 text-sm text-emerald-600">Active interviews</p>
          </div>

          <div className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Accepted</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                🎉
              </div>
            </div>
            <p className="mt-4 text-4xl font-bold text-emerald-600">
              {stats.accepted}
            </p>
            <p className="mt-1 text-sm text-emerald-600">Congratulations!</p>
          </div>

          <div className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Rejected</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                😔
              </div>
            </div>
            <p className="mt-4 text-4xl font-bold text-red-600">
              {stats.rejected}
            </p>
            <p className="mt-1 text-sm text-red-500">Keep going</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
          {/* Recent Applications */}
          <div className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-sm backdrop-blur-xl lg:col-span-4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Applications</h2>
              <button
                onClick={() => navigate("/applications")}
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
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
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-2xl font-semibold text-white ${
                          [
                            "bg-blue-600",
                            "bg-emerald-600",
                            "bg-purple-600",
                            "bg-rose-600",
                          ][(app.company?.length || 0) % 4]
                        }`}
                      >
                        {getInitial(app.company)}
                      </div>
                      <div>
                        <p className="font-medium">{app.position}</p>
                        <p className="text-sm text-gray-500">{app.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block rounded-full px-4 py-1 text-xs font-medium ${getStatusColor(app.status)}`}
                      >
                        {app.status || "Applied"}
                      </span>
                      <p className="mt-1 text-xs text-gray-500">
                        {app.applicationDate
                          ? new Date(app.applicationDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <div className="text-6xl mb-3">📭</div>
                  <p className="text-gray-500">
                    {searchTerm
                      ? "No matching applications found."
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
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Enhanced Dashboard */}
          <div className="space-y-6 lg:col-span-3">
            {/* Application Status */}
            <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur-xl">
              {/* Decorative Background Glow */}
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-100 blur-3xl opacity-40" />
              <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-purple-100 blur-3xl opacity-30" />

              {/* Header */}
              <div className="relative mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Application Status
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Overview of your job search journey
                  </p>
                </div>

                <button
                  onClick={() => navigate("/applications")}
                  className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-all hover:scale-105 hover:bg-blue-100"
                >
                  View All →
                </button>
              </div>

              {/* Top Analytics */}
              <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-5">
                {/* Donut Chart Section */}
                <div className="lg:col-span-2 flex items-center justify-center">
                  <div className="relative flex items-center justify-center">
                    {/* Outer Glow */}
                    <div className="absolute h-52 w-52 rounded-full bg-gradient-to-br from-blue-100 via-purple-100 to-emerald-100 blur-2xl opacity-40" />

                    {/* Donut */}
                    <div className="relative h-44 w-44 rounded-full bg-[conic-gradient(#3B82F6_0deg_140deg,#8B5CF6_140deg_220deg,#10B981_220deg_280deg,#EF4444_280deg_360deg)] shadow-inner flex items-center justify-center">
                      {/* Inner Circle */}
                      <div className="h-28 w-28 rounded-full bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center shadow-sm">
                        <p className="text-3xl font-bold text-gray-900">
                          {stats.totalApplications}
                        </p>

                        <p className="text-xs font-medium text-gray-500 tracking-wide">
                          TOTAL
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Cards */}
                <div className="lg:col-span-3 space-y-4">
                  {/* Applied */}
                  <div
                    onClick={() => navigate("/applications?status=Applied")}
                    className="group flex cursor-pointer items-center justify-between rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-xl transition-all group-hover:scale-110">
                        📝
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">Applied</p>

                        <p className="text-xs text-gray-500">
                          Awaiting response
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {stats.totalApplications -
                          stats.interviewing -
                          stats.accepted -
                          stats.rejected}
                      </p>

                      <div className="mt-1 h-2 w-24 overflow-hidden rounded-full bg-blue-100">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{
                            width: `${
                              ((stats.totalApplications -
                                stats.interviewing -
                                stats.accepted -
                                stats.rejected) /
                                stats.totalApplications) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Interviewing */}
                  <div
                    onClick={() =>
                      navigate("/applications?status=Interviewing")
                    }
                    className="group flex cursor-pointer items-center justify-between rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-xl transition-all group-hover:scale-110">
                        🎯
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">
                          Interviewing
                        </p>

                        <p className="text-xs text-gray-500">
                          Active interview rounds
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">
                        {stats.interviewing}
                      </p>

                      <div className="mt-1 h-2 w-24 overflow-hidden rounded-full bg-purple-100">
                        <div
                          className="h-full rounded-full bg-purple-500"
                          style={{
                            width: `${
                              (stats.interviewing / stats.totalApplications) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Accepted */}
                  <div
                    onClick={() => navigate("/applications?status=Offered")}
                    className="group flex cursor-pointer items-center justify-between rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-xl transition-all group-hover:scale-110">
                        🎉
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">Accepted</p>

                        <p className="text-xs text-gray-500">Offers received</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">
                        {stats.accepted}
                      </p>

                      <div className="mt-1 h-2 w-24 overflow-hidden rounded-full bg-emerald-100">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{
                            width: `${
                              (stats.accepted / stats.totalApplications) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rejected */}
                  <div
                    onClick={() => navigate("/applications?status=Rejected")}
                    className="group flex cursor-pointer items-center justify-between rounded-2xl border border-red-100 bg-gradient-to-r from-red-50 to-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-xl transition-all group-hover:scale-110">
                        💪
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">Rejected</p>

                        <p className="text-xs text-gray-500">Keep improving</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-500">
                        {stats.rejected}
                      </p>

                      <div className="mt-1 h-2 w-24 overflow-hidden rounded-full bg-red-100">
                        <div
                          className="h-full rounded-full bg-red-500"
                          style={{
                            width: `${
                              (stats.rejected / stats.totalApplications) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Metrics */}
              {stats.totalApplications > 0 && (
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {/* Success Rate */}
                  <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Success Rate</p>

                        <p className="mt-1 text-3xl font-bold text-emerald-600">
                          {Math.round(
                            (stats.accepted / stats.totalApplications) * 100,
                          )}
                          %
                        </p>
                      </div>

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                        🚀
                      </div>
                    </div>
                  </div>

                  {/* Interview Rate */}
                  <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Interview Rate</p>

                        <p className="mt-1 text-3xl font-bold text-purple-600">
                          {Math.round(
                            (stats.interviewing / stats.totalApplications) *
                              100,
                          )}
                          %
                        </p>
                      </div>

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
                        🎯
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Upcoming Interviews */}
            <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur-xl">
              {/* Glow */}
              <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-purple-100 blur-3xl opacity-50" />

              <div className="relative flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Upcoming Interviews
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Stay prepared for your next opportunity
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100">
                  <Calendar className="text-purple-600" size={22} />
                </div>
              </div>

              {stats.interviewing > 0 ? (
                <div className="space-y-4">
                  {/* Interview Card */}
                  <div className="group rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-white p-4 transition-all hover:shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
                        📅
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">
                              Interview Scheduled
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              You have{" "}
                              <span className="font-semibold text-purple-600">
                                {stats.interviewing}
                              </span>{" "}
                              active interview
                              {stats.interviewing > 1 ? "s" : ""}
                            </p>
                          </div>

                          <div className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                            Upcoming
                          </div>
                        </div>

                        {/* Mini Timeline */}
                        <div className="mt-4 flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                          <div className="h-[2px] flex-1 bg-purple-200" />
                          <div className="h-2 w-2 rounded-full bg-purple-300" />
                          <div className="h-[2px] flex-1 bg-purple-200" />
                          <div className="h-2 w-2 rounded-full bg-purple-200" />
                        </div>

                        <button
                          onClick={() =>
                            navigate("/applications?status=Interviewing")
                          }
                          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-purple-700 hover:scale-105"
                        >
                          View Interviews
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-12 text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
                    <Calendar size={36} className="text-gray-400" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-700">
                    No interviews yet
                  </h3>

                  <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">
                    Keep applying consistently — your next opportunity could be
                    one application away.
                  </p>

                  <button
                    onClick={() => navigate("/applications")}
                    className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-all hover:bg-blue-700 hover:scale-105"
                  >
                    Explore Applications
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* Bottom CTA */}
              <button
                onClick={() => navigate("/applications/add")}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 py-3 font-medium text-blue-600 transition-all hover:bg-blue-100 hover:shadow-sm"
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
