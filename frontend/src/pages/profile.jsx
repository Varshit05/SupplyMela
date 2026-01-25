import { useEffect, useState } from "react";
import api from "../api/vendorAxios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Input, Textarea, Upload } from "../components/FormElements";
import { FiUser, FiFileText, FiCreditCard, FiArrowLeft, FiArrowRight, FiCheck } from "react-icons/fi";

const Profile = () => {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/vendors/profile").then(res => {
      setForm(res.data || {});
      setLoading(false);
    });
  }, []);

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => s - 1);

  const handleFile = (e, key) => {
    setForm({ ...form, [key]: e.target.files[0] });
  };

  const submit = async () => {
    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => fd.append(key, value));
    try {
      await api.put("/vendors/profile", fd);
      toast.success("Profile updated successfully");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Update failed. Please check your details.");
    }
  };

  if (loading) return <ProfileSkeleton />;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
          <div key={item.s} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              step >= item.s ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-300 text-slate-400"
            }`}>
              {step > item.s ? <FiCheck strokeWidth={3} /> : item.icon}
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${step >= item.s ? "text-indigo-600" : "text-slate-400"}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div className="card shadow-xl border-none p-8 md:p-10 bg-white rounded-3xl">
        <form className="space-y-6">
          {/* STAGE 1: Business Info */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input label="Entity Name" value={form.entityName || ""} 
                  onChange={e => setForm({ ...form, entityName: e.target.value })} required />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Entity Type</label>
                <select
                  className="input cursor-pointer w-full p-3 rounded-xl border border-slate-200"
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

          {/* STAGE 2: Compliance */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="PAN Number" value={form.panNumber || ""} 
                onChange={e => setForm({ ...form, panNumber: e.target.value })} required />
              
              <Input label="CIN (Optional)" value={form.cin || ""} 
                onChange={e => setForm({ ...form, cin: e.target.value })} />

              <Upload label="PAN Card Document" onChange={e => handleFile(e, "panFile")} required />
              <Upload label="GST Certificate(s)" onChange={e => handleFile(e, "gstFile")} required />
            </div>
          )}

          {/* STAGE 3: Banking */}
          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Bank Account Number" value={form.bankAccount || ""} 
                onChange={e => setForm({ ...form, bankAccount: e.target.value })} />
              <Input label="IFSC Code" value={form.ifsc || ""} 
                onChange={e => setForm({ ...form, ifsc: e.target.value })} />
            </div>
          )}

          {/* NAVIGATION BUTTONS */}
          <div className="pt-8 border-t border-slate-100 flex justify-between gap-4">
            <button
              type="button"
              onClick={prev}
              disabled={step === 1}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${step === 1 ? "invisible" : "bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center gap-2"}`}
            >
              <FiArrowLeft /> Previous
            </button>

            {step < 3 ? (
              <button type="button" onClick={next} className="bg-indigo-600 text-white px-8 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-all flex items-center gap-2">
                Continue <FiArrowRight />
              </button>
            ) : (
              <button type="button" onClick={submit} className="bg-emerald-600 text-white px-10 py-2 rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2">
                Complete Setup <FiCheck />
              </button>
            )}
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
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-slate-100 rounded w-20"></div>
            <div className="h-12 bg-slate-50 rounded-xl border border-slate-100"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Profile;