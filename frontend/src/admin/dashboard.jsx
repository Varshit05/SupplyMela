import { useEffect, useState } from "react";
import api from "../api/adminAxios";
import { Link } from "react-router-dom";
import FractionalRating from "../components/FractionalRating";
import { FiUsers, FiSearch, FiArrowUpRight, FiShield, FiStar } from "react-icons/fi";

const AdminDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUpdatesOnly, setShowUpdatesOnly] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        // Adding the timestamp ?t=... ensures the browser doesn't use a cached version
        const res = await api.get(`admin/vendors?t=${Date.now()}`);
        setVendors(res.data);
      } catch (err) {
        console.error("Failed to fetch vendors", err);
      }
    };
    fetchVendors();
    window.addEventListener('focus', fetchVendors);
    return () => {
      window.removeEventListener('focus', fetchVendors);
    };
  }, []);

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.companyName?.toLowerCase().includes(searchTerm.toLowerCase());

    // If showOnlyUpdates is true, we add an extra condition
    if (showUpdatesOnly) {
      return matchesSearch && v.hasUnseenChanges;
    }

    return matchesSearch;
  });

  // Change this block in your AdminDashboard
  const updatedVendorsList = filteredVendors.map(v => ({
    ...v,
    // Ensure this matches the property name from your backend (e.g., hasUnseenChanges)
    isNotify: v.hasUnseenChanges === true
  }));

  const totalUpdatesCount = updatedVendorsList.filter(v => v.isNotify).length;
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {totalUpdatesCount > 0 && (
        <div className="bg-indigo-600 text-white px-4 py-3 rounded-xl flex items-center justify-between shadow-lg shadow-indigo-200">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <FiShield className="animate-bounce" />
            </div>
            <p className="text-sm font-medium">
              There are <strong>{totalUpdatesCount}</strong> vendor profiles with recent changes requiring review.
            </p>
          </div>
          <button
            onClick={() => setShowUpdatesOnly(!showUpdatesOnly)}
            className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors ${showUpdatesOnly ? "bg-amber-400 text-slate-900" : "bg-white text-indigo-600"
              }`}
          >
            {showUpdatesOnly ? "Show All Vendors" : "View Only Updates"}
          </button>
        </div>
      )}
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage and verify your global network of vendors.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or company..."
            className="input pl-10 bg-white shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Vendors" count={vendors.length} icon={<FiUsers />} color="indigo" />
        <StatCard title="Pending KYC" count={vendors.filter(v => v.kycStatus === 'pending').length} icon={<FiShield />} color="amber" />
        <StatCard title="Approved" count={vendors.filter(v => v.kycStatus === 'approved').length} icon={<FiShield />} color="emerald" />
      </div>

      {/* Vendor Table Card */}
      <div className="card p-0 overflow-hidden border-slate-200 shadow-xl bg-white">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-800">Vendor Accounts</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-widest font-bold">
                <th className="p-4 border-b border-slate-100">Account Name</th>
                <th className="p-4 border-b border-slate-100">Company</th>
                <th className="p-4 border-b border-slate-100 text-center">KYC Status</th>
                <th className="p-4 border-b border-slate-100 text-center">Trust Rating</th>
                <th className="p-4 border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {updatedVendorsList.map((v) => (
                <tr key={v._id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-700">{v.name}</p>
                      {/* NEW: Notification badge for changes */}
                      {v.isNotify && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter md:hidden">
                      {v.companyName}
                    </p>
                  </td>
                  <td className="p-4 text-slate-500 text-sm hidden md:table-cell">
                    {v.companyName || "—"}
                  </td>

                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${v.kycStatus === "approved" ? "bg-emerald-100 text-emerald-700" :
                      v.kycStatus === "rejected" ? "bg-rose-300 text-rose-900 border border-rose-300" : "bg-amber-100 text-amber-700"
                      }`}>
                      {v.kycStatus || "pending"}
                    </span>
                  </td>

                  {/* UPDATED: Star Rating Display */}
                  {/* UPDATED: Star Rating Display in Table */}
                  <td className="p-4 text-center">
                    {v.trust?.rating > 0 ? (
                      <div className="flex flex-col items-center gap-1">
                        <FractionalRating rating={v.trust.rating} size={14} />
                        <span className="text-[9px] font-bold text-slate-400">
                          {v.trust.rating.toFixed(1)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-300 uppercase italic">
                        Unrated
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    <Link
                      to={`/admin/vendors/${v._id}`}
                      className="inline-flex items-center gap-1 text-indigo-600 font-bold text-sm hover:text-indigo-800 transition-colors"
                    >
                      <span className="hidden sm:inline">Details</span> <FiArrowUpRight />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper for Stats
const StatCard = ({ title, count, icon, color }) => {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600"
  };
  return (
    <div className="card flex items-center gap-4 border-none shadow-md">
      <div className={`p-4 rounded-2xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{count}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;