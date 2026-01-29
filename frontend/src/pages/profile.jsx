import { useEffect, useState } from "react";
import api from "../api/vendorAxios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Input, Textarea, Upload } from "../components/FormElements";
import { 
  FiUser, 
  FiFileText, 
  FiCreditCard, 
  FiArrowLeft, 
  FiArrowRight, 
  FiCheck,
  FiLoader 
} from "react-icons/fi";

const Profile = () => {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Fetch existing data on mount
  useEffect(() => {
    api.get("/vendors/profile")
      .then(res => {
        setForm(res.data || {});
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        toast.error("Failed to load profile data");
      });
  }, []);

  const handleFile = (e, key) => {
    setForm({ ...form, [key]: e.target.files[0] });
  };

  const prev = () => setStep(s => s - 1);

  // Unified Save & Continue Logic
  const handleSave = async (isFinal = false) => {
    setIsSaving(true);
    
    const fd = new FormData();
    // Append all current form fields to FormData
    Object.entries(form).forEach(([key, value]) => {
      // Only append if value exists to avoid sending "undefined" strings
      if (value !== null && value !== undefined) {
        fd.append(key, value);
      }
    });

    try {
      await api.put("/vendors/profile", fd);
      toast.success(isFinal ? "Profile updated!" : "Progress saved");
      
      if (isFinal) {
        navigate("/dashboard");
      } else {
        setStep(s => s + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed. Please check your details.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <ProfileSkeleton />;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Complete Your Profile</h2>
        <p className="text-slate-500 mt-2">Please provide your business and compliance details to get verified.</p>
      </div>

      {/* Visual Stepper */}
      <div className="relative flex justify-between items-center max-w-2xl mx-auto mb-12">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
        {[
          { s: 1, label: "Business", icon: <FiUser /> },
          { s: 2, label: "Compliance", icon: <FiFileText /> },
          { s: 3, label: "Banking", icon: <FiCreditCard /> }
        ].map((item) => (
          <div key={item.s} className="flex flex-col items-center gap-2 bg-slate-50 md:bg-transparent px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              step >= item.s ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-300 text-slate-400"
            }`}>
              {step > item.s ? <FiCheck strokeWidth={3} /> : item.icon}
            </div>
            <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${step >= item.s ? "text-indigo-600" : "text-slate-400"}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div className="card shadow-xl border-none p-6 md:p-10 bg-white rounded-3xl">
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          
          {/* STEP 1: Business Info */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input label="Entity Name" value={form.entityName || ""} 
                  onChange={e => setForm({ ...form, entityName: e.target.value })} required />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Entity Type</label>
                <select
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={form.entityType || ""}
                  onChange={e => setForm({ ...form, entityType: e.target.value })}
                  required
                >
                  <option value="" disabled>Select entity type</option>
                  <option value="Private Limited Company">Private Limited Company</option>
                  <option value="Sole Proprietorship">Sole Proprietorship</option>
                  <option value="Partnership Firm">Partnership Firm</option>
                </select>
              </div>

              <Input label="SPOC Name" value={form.spocName || ""} 
                onChange={e => setForm({ ...form, spocName: e.target.value })} required />

              <Input label="Phone Number (+91)" value={form.phone || ""} 
                onChange={e => setForm({ ...form, phone: e.target.value })} required />

              <Input label="Alternative Contact" value={form.altPhone || ""} 
                onChange={e => setForm({ ...form, altPhone: e.target.value })} />

              <div className="md:col-span-2">
                <Textarea label="Registered Address" value={form.registeredAddress || ""} 
                  onChange={e => setForm({ ...form, registeredAddress: e.target.value })} required />
              </div>
            </div>
          )}

          {/* STEP 2: Compliance (Improved Layout) */}
          {step === 2 && (
            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                  <h3 className="text-lg font-bold text-slate-800">Identity Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="PAN Number" value={form.panNumber || ""} 
                    onChange={e => setForm({ ...form, panNumber: e.target.value.toUpperCase() })} required />
                  <Input label="GST Number" value={form.gstNumber || ""} 
                    onChange={e => setForm({ ...form, gstNumber: e.target.value.toUpperCase() })} required />
                  <div className="md:col-span-2">
                    <Input label="CIN (Optional)" value={form.cin || ""} 
                      onChange={e => setForm({ ...form, cin: e.target.value.toUpperCase() })} />
                  </div>
                </div>
              </section>

              <hr className="border-slate-100" />

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                  <h3 className="text-lg font-bold text-slate-800">Supporting Documents</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <Upload label="PAN Card Document" onChange={e => handleFile(e, "panFile")} required />
                  <Upload label="GST Certificate(s)" onChange={e => handleFile(e, "gstFile")} required />
                </div>
              </section>
            </div>
          )}

          {/* STEP 3: Banking */}
          {step === 3 && (
            <div className="space-y-6">
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                  <h3 className="text-lg font-bold text-slate-800">Banking Information</h3>
                </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Bank Account Number" value={form.bankAccount || ""} 
                  onChange={e => setForm({ ...form, bankAccount: e.target.value })} required />
                <Input label="IFSC Code" value={form.ifsc || ""} 
                  onChange={e => setForm({ ...form, ifsc: e.target.value.toUpperCase() })} required />
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm">
                <strong>Note:</strong> Ensure the bank account name matches your registered entity name to avoid payment delays.
              </div>
            </div>
          )}

          {/* NAVIGATION BUTTONS */}
          <div className="pt-8 border-t border-slate-100 flex justify-between items-center gap-4">
            <button
              type="button"
              onClick={prev}
              disabled={step === 1 || isSaving}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 
                ${step === 1 ? "invisible" : "bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50"}`}
            >
              <FiArrowLeft /> Previous
            </button>

            <button 
              type="button" 
              onClick={() => handleSave(step === 3)} 
              disabled={isSaving}
              className={`min-w-[160px] flex justify-center items-center gap-2 px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100
                ${step === 3 
                  ? "bg-emerald-600 text-white hover:bg-emerald-700" 
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
                } disabled:opacity-70`}
            >
              {isSaving ? (
                <>
                  <FiLoader className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  {step === 3 ? "Complete Setup" : "Save & Continue"} 
                  {step === 3 ? <FiCheck /> : <FiArrowRight />}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto space-y-8 animate-pulse p-6">
    <div className="space-y-3">
      <div className="h-8 bg-slate-200 rounded-lg w-1/3"></div>
      <div className="h-4 bg-slate-100 rounded-lg w-1/2"></div>
    </div>
    <div className="flex justify-between max-w-2xl mx-auto mb-12">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-slate-200"></div>
          <div className="h-3 bg-slate-100 rounded w-12"></div>
        </div>
      ))}
    </div>
    <div className="bg-white rounded-3xl p-10 h-96 border border-slate-100 shadow-sm"></div>
  </div>
);

export default Profile;