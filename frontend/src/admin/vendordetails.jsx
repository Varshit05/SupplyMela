import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/adminAxios";
import { toast } from "react-toastify";
import { 
  FiArrowLeft, FiExternalLink, FiFileText, FiBriefcase, 
  FiCreditCard, FiCheckCircle, FiXCircle, FiStar 
} from "react-icons/fi";

const VendorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    api.get(`/admin/vendors/${id}`).then((res) => {
      setVendor(res.data);
      // Initialize rating from backend trustScore (assuming 1-5 scale)
      setRating(res.data.trust?.rating || 0);
    });
  }, [id]);

  const updateKYC = async (status) => {
    try {
      await api.put(`/admin/vendors/${id}/kyc`, { status });
      toast.success(`Account has been ${status}`);
      setVendor({ ...vendor, kycStatus: status });
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const saveRating = async (newScore) => {
  try {
    const res = await api.put(`/admin/vendors/${id}/rate`, {
      rating: newScore
    });

    // 🔥 single source of truth = backend
    setVendor((prev) => ({
      ...prev,
      trust: res.data.trust
    }));

    setRating(res.data.trust.rating);

    toast.success(`Trust rating updated to ${newScore} stars`);
  } catch (err) {
    toast.error("Failed to update trust rating");
  }
};


  if (!vendor) return (
    <div className="flex items-center justify-center min-h-[60vh] animate-pulse">
      <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors"
        >
          <FiArrowLeft /> Back to Vendors
        </button>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => updateKYC("rejected")} 
            className="btn btn-secondary border-rose-200 text-rose-600 hover:bg-rose-50 flex-1 md:flex-none"
          >
            <FiXCircle /> Reject
          </button>
          <button 
            onClick={() => updateKYC("approved")} 
            className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 flex-1 md:flex-none"
          >
            <FiCheckCircle /> Approve Account
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card shadow-xl border-none">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{vendor.companyName || vendor.name}</h2>
                <p className="text-indigo-600 font-semibold mt-1 flex items-center gap-2">
                  <FiBriefcase /> {vendor.entityType || "Business Entity"}
                </p>
              </div>
              <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${
                vendor.kycStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                vendor.kycStatus === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {vendor.kycStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-slate-50">
              <DetailBox label="Authorized Name" value={vendor.name} />
              <DetailBox label="Contact Email" value={vendor.email} />
              <DetailBox label="Phone Number" value={vendor.phone} />
              <DetailBox label="SPOC Name" value={vendor.spocName} />
            </div>
          </div>

          <div className="card bg-slate-50 border-none">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Compliance & Identification</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <DetailBox label="GST Number" value={vendor.gstNumber} />
              <DetailBox label="PAN Number" value={vendor.panNumber} />
              <DetailBox label="CIN Number" value={vendor.cin} />
            </div>
          </div>
        </div>

        {/* Sidebar Column: Trust, Bank & Docs */}
        <div className="space-y-6">
          
          {/* NEW: Star Rating Card */}
          <div className="card border-slate-200 shadow-sm text-center">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Admin Trust Evaluation
            </h4>
            <div className="flex justify-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => saveRating(star)}
                  className="transition-transform active:scale-90 hover:scale-110"
                >
                  <FiStar
                    size={32}
                    className={`transition-colors duration-200 ${
                      star <= rating 
                        ? "fill-amber-400 text-amber-400" 
                        : "text-slate-200 fill-slate-50"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-bold text-slate-600">
              {rating > 0 ? `${rating} / 5 Stars` : "Not Rated"}
            </p>
          </div>

          {/* Banking Details */}
          <div className="card bg-slate-900 text-white border-none shadow-2xl">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <FiCreditCard className="text-indigo-400" /> Banking Details
            </h4>
            <div className="space-y-4 font-mono">
              <DetailBox label="Account Number" value={vendor.bankDetails?.accountNumber} dark />
              <DetailBox label="IFSC Code" value={vendor.bankDetails?.ifsc} dark />
            </div>
          </div>

          {/* Documents */}
          <div className="card border-slate-200">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FiFileText className="text-indigo-500" /> Documents
            </h4>
            <div className="space-y-2">
              <DocumentLink label="GST Certificate" url={vendor.documents?.gstCert} />
              <DocumentLink label="PAN Card" url={vendor.documents?.panCard} />
              <DocumentLink label="Business License" url={vendor.documents?.license} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const DetailBox = ({ label, value, dark = false }) => (
  <div>
    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
      {label}
    </p>
    <p className={`font-semibold ${dark ? 'text-indigo-200' : 'text-slate-700'}`}>
      {value || "—"}
    </p>
  </div>
);

const DocumentLink = ({ label, url }) => url ? (
  <a 
    href={url} 
    target="_blank" 
    rel="noreferrer" 
    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-300 hover:bg-white text-slate-600 text-xs font-bold uppercase transition-all group"
  >
    {label} <FiExternalLink className="text-slate-300 group-hover:text-indigo-600" />
  </a>
) : null;

export default VendorDetails;