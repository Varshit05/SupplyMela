import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/adminAxios";
import { toast } from "react-toastify";
import {
  FiArrowLeft, FiExternalLink, FiFileText, FiBriefcase,
  FiCreditCard, FiCheckCircle, FiXCircle, FiStar, FiInfo,
  FiPackage, FiShoppingBag, FiX, FiMaximize2, FiLayers, FiSettings
} from "react-icons/fi";

const VendorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Data States
  const [vendor, setVendor] = useState(null);
  const [rating, setRating] = useState(0);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // UI States
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [vendorRes, productsRes] = await Promise.all([
          api.get(`/admin/vendors/${id}`),
          api.get(`/admin/vendors/${id}/products`)
        ]);

        setVendor(vendorRes.data);
        setRating(vendorRes.data.trust?.rating || 0);
        setProducts(productsRes.data);
      } catch (err) {
        toast.error("Error loading vendor profile");
        console.error(err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchAllData();
  }, [id]);

  const updateKYC = async (status) => {
    const confirmMsg = status === "approved"
      ? "Approve this vendor for the marketplace?"
      : "Are you sure you want to REJECT this vendor?";

    if (!window.confirm(confirmMsg)) return;

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
      setVendor((prev) => ({ ...prev, trust: res.data.trust }));
      setRating(res.data.trust.rating);
      toast.success(`Trust rating updated to ${newScore} stars`);
    } catch (err) {
      toast.error("Failed to update trust rating");
    }
  };

  if (!vendor) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium">Loading Vendor Dossier...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in slide-in-from-bottom-4 duration-500">

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Vendors
        </button>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => updateKYC("rejected")}
            className="btn border-rose-200 text-rose-600 hover:bg-rose-50 flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-bold transition-all"
          >
            <FiXCircle /> Reject
          </button>
          <button
            onClick={() => updateKYC("approved")}
            className="btn bg-emerald-600 hover:bg-emerald-700 text-white flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-bold shadow-lg shadow-emerald-200 transition-all"
          >
            <FiCheckCircle /> Approve Account
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card shadow-xl border-none bg-white p-8 rounded-3xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {vendor.companyName || vendor.name}
                </h2>
                <p className="text-indigo-600 font-semibold mt-1 flex items-center gap-2">
                  <FiBriefcase /> {vendor.entityType || "Business Entity"}
                </p>
              </div>
              <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${vendor.kycStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                vendor.kycStatus === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                }`}>
                {vendor.kycStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-t border-slate-100">
              <DetailBox label="Authorized Name" value={vendor.name} />
              <DetailBox label="Contact Email" value={vendor.email} />
              <DetailBox label="Phone Number" value={vendor.phone} />
              <DetailBox label="SPOC Name" value={vendor.spocName} />
            </div>

            <div className="mt-4 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <FiInfo className="text-indigo-500" size={18} />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Company Description
                </h3>
              </div>
              <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm">
                  {vendor.description || "No professional description provided."}
                </p>
              </div>
            </div>
          </div>

          {/* Compliance Info - Fixed Mapping */}
          <div className="card bg-slate-50 border-none p-6 rounded-2xl">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
              Compliance & Identification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <DetailBox label="GST Number" value={vendor.gstNumber} />
              <DetailBox label="PAN Number" value={vendor.panNumber} />
              <DetailBox label="CIN Number" value={vendor.cin} />
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <div className="card bg-white border-slate-200 shadow-sm text-center p-6 rounded-3xl">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Trust Rating
            </h4>
            <div className="flex justify-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => saveRating(star)}>
                  <FiStar
                    size={32}
                    className={`${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-50"}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="card bg-slate-900 text-white border-none shadow-2xl p-6 rounded-3xl">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <FiCreditCard className="text-indigo-400" /> Banking Details
            </h4>
            <div className="space-y-4 font-mono">
              <DetailBox label="Account Number" value={vendor.bankDetails?.accountNumber} dark />
              <DetailBox label="IFSC Code" value={vendor.bankDetails?.ifsc} dark />
            </div>
          </div>

          {/* Document Mapping Fix */}
          <div className="card bg-white border-slate-200 p-6 rounded-3xl">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FiFileText className="text-indigo-500" /> Verified Documents
            </h4>
            <div className="space-y-2">
              <DocumentLink label="GST Certificate" url={vendor.documents?.gstCert} />
              <DocumentLink label="PAN Card" url={vendor.documents?.panCard} />
            </div>
          </div>
        </div>
      </div>

      {/* Product Catalog Section */}
      <div className="card bg-white shadow-xl border-none p-8 rounded-3xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <FiPackage size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Products</h2>
          </div>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-50 rounded-2xl"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => setSelectedProduct(product)}
                className="group relative p-4 rounded-3xl border border-slate-100 bg-white hover:border-indigo-500 hover:shadow-2xl transition-all cursor-pointer"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 relative">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300"><FiShoppingBag size={24} /></div>
                    )}
                    <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/20 flex items-center justify-center transition-colors">
                      <FiMaximize2 className="text-white opacity-0 group-hover:opacity-100" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{product.name}</h4>
                    <p className="text-emerald-600 font-bold text-lg mt-1">₹{product.price.toLocaleString()}</p>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded inline-block mt-2">{product.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- PRODUCT DETAIL MODAL --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/20">

            {/* Left: Image Scroller */}
            <div className="md:w-3/5 bg-slate-50 p-6 overflow-y-auto custom-scrollbar border-r border-slate-100">
              <div className="grid grid-cols-1 gap-4">
                {selectedProduct.images?.map((img, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-2 shadow-sm border border-slate-200">
                    <img src={img} alt="" className="w-full h-auto rounded-2xl object-contain" />
                  </div>
                ))}
                {(!selectedProduct.images || selectedProduct.images.length === 0) && (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-300 bg-slate-100 rounded-3xl"><FiShoppingBag size={48} /><p>No Images</p></div>
                )}
              </div>
            </div>

            {/* Right: Detailed Content */}
            <div className="md:w-2/5 p-10 overflow-y-auto relative">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 p-3 bg-slate-100 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-all"><FiX size={24} /></button>

              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 leading-tight">{selectedProduct.name}</h3>
                  <p className="text-3xl font-bold text-emerald-600 mt-4">₹{selectedProduct.price.toLocaleString()}</p>
                  <span className="inline-block mt-4 px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">{selectedProduct.type}</span>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><FiLayers className="text-indigo-500" /> Description</h4>
                  <div className="bg-slate-50 p-6 rounded-2xl text-slate-600 text-sm leading-relaxed whitespace-pre-line border border-slate-100">
                    {selectedProduct.description || "No description provided."}
                  </div>
                </div>

                {selectedProduct.catalogue && (
                  <a href={selectedProduct.catalogue} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl">
                    <FiFileText /> View Catalogue
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- SUB-COMPONENTS --- */
const DetailBox = ({ label, value, dark = false }) => (
  <div>
    <p className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
      {label}
    </p>
    <p className={`font-semibold text-sm ${dark ? 'text-indigo-100' : 'text-slate-700'}`}>
      {value || "Not Provided"}
    </p>
  </div>
);

const DocumentLink = ({ label, url }) => url ? (
  <a
    href={url}
    target="_blank"
    rel="noreferrer"
    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-300 hover:bg-white text-slate-700 text-xs font-bold uppercase transition-all group"
  >
    {label} <FiExternalLink className="text-slate-300 group-hover:text-indigo-600 transition-transform" />
  </a>
) : (
  <div className="p-4 rounded-2xl bg-slate-50/50 border border-dashed border-slate-200 text-slate-300 text-[10px] font-bold uppercase tracking-widest">
    {label} (Missing)
  </div>
);

export default VendorDetails;