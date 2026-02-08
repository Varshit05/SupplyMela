import { useEffect, useState } from "react";
import api from "../api/vendorAxios";
import { useNavigate } from "react-router-dom";
import StarRating from "../components/Star";
import {
  FiEdit,
  FiUser,
  FiBriefcase,
  FiShield,
  FiBarChart2,
  FiStar
} from "react-icons/fi";

const Dashboard = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await api.get("/vendors/profile");
        setVendor(res.data);
      } catch {
        setError("Failed to load vendor profile");
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-rose-200 bg-rose-50 text-rose-700 max-w-md mx-auto mt-10 text-center">
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, {vendor.name} 👋
          </h2>
          <p className="text-slate-500 mt-1">
            Here is what is happening with your account today.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/profile")}
        >
          <FiEdit className="text-lg" />
          Edit Profile
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ⭐ Trust Rating Card */}
        <div className="card flex flex-col items-center justify-center text-center py-8">
          <p className="text-slate-500 font-medium mb-3 flex items-center gap-2">
            <FiShield className="text-indigo-600" /> Trust Rating
          </p>

          {/* New Implementation */}
          <div className="mb-2">
            <StarRating rating={vendor.trust?.rating || 0} />
          </div>

          <p className="text-sm font-bold text-slate-700">
            {vendor.trust?.rating
              ? `${vendor.trust.rating.toFixed(1)} / 5 Stars` // toFixed(1) ensures 4.500001 displays as 4.5
              : "Not Rated Yet"}
          </p>

          {vendor.trust?.reviewedAt && (
            <p className="text-xs text-slate-400 mt-1">
              Reviewed on {new Date(vendor.trust.reviewedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* KYC Status Card */}
        <div className="card flex flex-col items-center justify-center text-center">
          <div
            className={`p-4 rounded-2xl mb-4 ${vendor.kycStatus === "approved"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-amber-50 text-amber-600"
              }`}
          >
            <FiBarChart2 size={32} />
          </div>

          <p className="text-slate-500 font-medium">Verification Status</p>
          <h3
            className={`text-xl font-bold mt-1 uppercase tracking-tight ${vendor.kycStatus === "approved"
                ? "text-emerald-600"
                : "text-amber-600"
              }`}
          >
            {vendor.kycStatus || "Pending"}
          </h3>
        </div>

        {/* Quick Info Card */}
        <div className="card space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <FiBriefcase />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase">
                Company
              </p>
              <p className="font-semibold text-slate-800">
                {vendor.companyName || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-slate-50">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <FiUser />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase">
                GST Number
              </p>
              <p className="font-semibold text-slate-800">
                {vendor.gstNumber || "Not Provided"}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
