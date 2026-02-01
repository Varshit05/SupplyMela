import { useEffect, useState } from "react";
import api from "../api/adminAxios";
import { Link } from "react-router-dom";
import { FiUsers, FiSearch, FiArrowUpRight, FiShield, FiStar } from "react-icons/fi";

const AdminDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api.get("/admin/vendors").then((res) => setVendors(res.data));
  }, []);

  const filteredVendors = vendors.filter(v => 
    v.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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
              {filteredVendors.map((v) => (
                <tr key={v._id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-4">
                    <p className="font-semibold text-slate-700">{v.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter md:hidden">
                       {v.companyName}
                    </p>
                  </td>
                  <td className="p-4 text-slate-500 text-sm hidden md:table-cell">
                    {v.companyName || "—"}
                  </td>
                  
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      v.kycStatus === "approved" ? "bg-emerald-100 text-emerald-700" : 
                      v.kycStatus === "rejected" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {v.kycStatus || "pending"}
                    </span>
                  </td>

                  {/* UPDATED: Star Rating Display */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      {v.trust.rating > 0 ? (
                        [1, 2, 3, 4, 5].map((s) => (
                          <FiStar 
                            key={s} 
                            size={14} 
                            className={s <= v.trust.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} 
                          />
                        ))
                      ) : (
                        <span className="text-[10px] font-bold text-slate-300 uppercase italic">Unrated</span>
                      )}
                    </div>
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