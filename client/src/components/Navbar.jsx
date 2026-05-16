import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, Search } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // If user is on Applications page, just update search
      if (location.pathname === "/applications") {
        // We can pass search via URL or context later
        navigate(`/applications?search=${encodeURIComponent(searchTerm)}`);
      } else {
        // Otherwise navigate to Applications with search
        navigate(`/applications?search=${encodeURIComponent(searchTerm)}`);
      }
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/dashboard")}>
          <div className="w-9 h-9 bg-blue-600 rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">TrackHire</h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-8">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search applications..."
              className="w-full pl-11 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </form>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <Bell size={22} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-medium text-lg">
              YT
            </div>
            <div className="hidden md:block">
              <p className="font-medium text-sm">Yitbarek T.</p>
              <p className="text-xs text-gray-500 -mt-0.5">Job Seeker</p>
            </div>
            <div className="text-gray-400">▼</div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;