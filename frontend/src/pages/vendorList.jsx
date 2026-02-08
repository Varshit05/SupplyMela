import { useEffect, useState } from "react";
import api from "../api/vendorAxios";
import StarRating from "../components/Star";
import { FiArrowRight, FiUsers, FiStar, FiCheckCircle } from "react-icons/fi";

const VendorList = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    api.get("/vendors").then((res) => {
      const filteredAndSorted = res.data
        .filter((v) => v.kycStatus === "approved")
        .sort((a, b) => (b.trust?.rating || 0) - (a.trust?.rating || 0));
      setVendors(filteredAndSorted);
    });
  }, []);


  return (
    <div className="space-y-8 animate-in fade-in duration-700 px-2 sm:px-0">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-center md:text-left">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center justify-center md:justify-start gap-3">
            <FiUsers className="text-indigo-600" /> Top Rated Vendors
          </h2>
          <p className="text-slate-500 mt-1 text-sm md:text-base">
            Showing vendors sorted by their community trust and verification status.
          </p>
        </div>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {vendors.map((v) => (
          <div key={v._id} className="card group flex flex-col justify-between border-slate-200 hover:border-indigo-200">
            <div>
              <div className="flex justify-between items-start mb-4 gap-2">
                <h3 className="font-bold text-lg md:text-xl text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {v.companyName || v.name}
                </h3>

                {/* KYC Status Badge */}
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${v.kycStatus === "approved"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
                  }`}>
                  {v.kycStatus || "pending"}
                </span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">
                {v.description || ""}
              </p>

              {/* NEW: Star Rating Display instead of Progress Bar */}
              <div className="mt-6 p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Trust Rating
                </span>
                <div className="flex items-center gap-2">
                  {/* Pass the rating and a slightly smaller size for the grid layout */}
                  <StarRating rating={v.trust?.rating || 0} size={16} />

                  {/* <span className="text-sm font-bold text-slate-700">
                    {v.trust?.rating
                      ? v.trust.rating.toFixed(1)
                      : "0.0"}
                  </span> */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorList;