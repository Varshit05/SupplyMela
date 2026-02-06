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
  FiLoader,
  FiX
} from "react-icons/fi";

const Profile = () => {
  const [form, setForm] = useState({});
  const [existingDocs, setExistingDocs] = useState({});
  const [selectedFileNames, setSelectedFileNames] = useState({
    panFile: "",
    gstFile: ""
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/vendors/profile")
      .then(res => {
        let data = res.data || {};

        // 1. Capture the existing Cloudinary URLs from the nested documents object
        if (data.documents) {
          setExistingDocs({
            panCard: data.documents.panCard,
            gstCert: data.documents.gstCert,
          });
        }

        // 2. Handle legacy address object (as discussed)
        if (data.address && typeof data.address === 'object') {
          data.address = data.address.street || "";
        }

        // 3. Clean the form state (exclude files but keep text fields)
        const FILE_KEYS = ["panFile", "gstFile", "documents"];
        const safeForm = Object.fromEntries(
          Object.entries(data).filter(([key]) => !FILE_KEYS.includes(key))
        );

        setForm(safeForm);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        toast.error("Failed to load profile data");
      });
  }, []);


  const handleFile = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Update the form data for the API
    setForm(prev => ({
      ...prev,
      [key]: file
    }));

    // 2. Update the UI display name
    setSelectedFileNames(prev => ({
      ...prev,
      [key]: file.name
    }));
  };


  const prev = () => setStep(s => s - 1);

  // Unified Save & Continue Logic
  const handleSave = async (isFinal = false) => {
    // --- VALIDATION LOGIC ---
    if (step === 1) {
      // Only validate phone on Step 1
      if (form.phone && !/^\d{10}$/.test(form.phone)) {
        return toast.error("Phone number must be exactly 10 digits");
      }
    }

    if (step === 2) {
      // Only validate PAN/GST when trying to leave Step 2
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      const cinRegex = /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

      if (form.panNumber && !panRegex.test(form.panNumber)) {
        return toast.error("Invalid PAN No.");
      }
      if (form.gstNumber && !gstRegex.test(form.gstNumber)) {
        return toast.error("Invalid GST No.");
      }
      if (form.cin && !cinRegex.test(form.cin)) {
        return toast.error("Invalid CIN");
      }
    }
    // Proceed with Saving
    setIsSaving(true);
    const fd = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value instanceof File) {
        fd.append(key, value);
        return;
      }
      if (typeof value === "string" || typeof value === "number") {
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
      toast.error(err.response?.data?.message || "Update failed.");
    } finally {
      setIsSaving(false);
    }
  };
  const removeSelectedFile = (key) => {
    // 1. Remove the File object from the form state
    setForm(prev => {
      const newForm = { ...prev };
      delete newForm[key];
      return newForm;
    });

    // 2. Clear the filename from the UI state
    setSelectedFileNames(prev => ({
      ...prev,
      [key]: ""
    }));
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
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step >= item.s ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-300 text-slate-400"
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
                <Input label="Entity Name" value={form.companyName || ""}
                placeholder="Registered business name"
                  onChange={e => setForm({ ...form, companyName: e.target.value })} required />
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
              placeholder="Point of Contact"
                onChange={e => setForm({ ...form, spocName: e.target.value })} required />

              <Input
                label="Phone Number (+91)"
                value={form.phone || ""}
                placeholder="e.g. 9876543210"
                maxLength={10}
                onChange={e => setForm({ ...form, phone: e.target.value })} required />

              <Input
                label="Alternative Contact"
                value={form.altPhone || ""}
                placeholder="e.g. 9123456780"
                maxLength={10}
                onChange={e => setForm({ ...form, altPhone: e.target.value })} />
              <div className="md:col-span-2">
                <Textarea
                  label="Business Description"
                  value={form.description || ""}
                  placeholder="Briefly describe your business..."
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="md:col-span-2">
                <Textarea label="Registered Address" value={form.address || ""}
                placeholder="Full registered business address"
                  onChange={e => setForm({ ...form, address: e.target.value })} required />
              </div>
            </div>
          )}

          {/* STEP 2: Compliance (Improved Layout) */}
          {step === 2 && (
            <div className="space-y-8">
              {/* Identity Details Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                  <h3 className="text-lg font-bold text-slate-800">Identity Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="PAN Number"
                    value={form.panNumber || ""}
                    placeholder="e.g. ABCDE1234F"
                    maxLength={10}
                    onChange={e => setForm({ ...form, panNumber: e.target.value.toUpperCase() })}
                    required
                  />
                  <Input
                    label="GST Number"
                    value={form.gstNumber || ""}
                    placeholder="e.g. 22ABCDE1234F1Z5"
                    maxLength={15}
                    onChange={e => setForm({ ...form, gstNumber: e.target.value.toUpperCase() })}
                    required
                  />
                  <Input
                    label="CIN (Optional)"
                    placeholder="e.g. U12345MH2020PTC123456"
                    value={form.cin || ""}
                    onChange={e => setForm({ ...form, cin: e.target.value.toUpperCase() })}
                  />
                </div>
              </section>

              <hr className="border-slate-100" />

              {/* Supporting Documents Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                  <h3 className="text-lg font-bold text-slate-800">Supporting Documents</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300">

                  {/* PAN Upload Card */}
                  <div className="space-y-3">
                    <Upload
                      label="PAN Card Document"
                      onChange={e => handleFile(e, "panFile")}
                      required={!existingDocs.panCard}
                    />

                    <div className="flex flex-col gap-2">
                      {/* STAGED FILE WITH REMOVE OPTION */}
                      {selectedFileNames.panFile && (
                        <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 px-3 py-2 rounded-xl group">
                          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 truncate">
                            <FiFileText className="shrink-0" />
                            <span className="truncate">{selectedFileNames.panFile}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSelectedFile("panFile")}
                            className="p-1 hover:bg-indigo-200 rounded-full text-indigo-600 transition-colors"
                            title="Remove file"
                          >
                            <FiX size={16} strokeWidth={3} />
                          </button>
                        </div>
                      )}

                      {/* EXISTING FILE FEEDBACK */}
                      {existingDocs.panCard && (
                        <div className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-md border w-fit transition-all ${selectedFileNames.panFile ? "opacity-40 grayscale" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}>
                          <FiCheck />
                          <a href={existingDocs.panCard} target="_blank" rel="noreferrer" className="underline hover:text-emerald-700">
                            {selectedFileNames.panFile ? "Replacing current document" : "View Current PAN"}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* GST Upload Card */}
                  <div className="space-y-3">
                    <Upload
                      label="GST Certificate(s)"
                      onChange={e => handleFile(e, "gstFile")}
                      required={!existingDocs.gstCert}
                    />

                    <div className="flex flex-col gap-2">
                      {/* STAGED FILE WITH REMOVE OPTION */}
                      {selectedFileNames.gstFile && (
                        <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 px-3 py-2 rounded-xl group">
                          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 truncate">
                            <FiFileText className="shrink-0" />
                            <span className="truncate">{selectedFileNames.gstFile}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSelectedFile("gstFile")}
                            className="p-1 hover:bg-indigo-200 rounded-full text-indigo-600 transition-colors"
                            title="Remove file"
                          >
                            <FiX size={16} strokeWidth={3} />
                          </button>
                        </div>
                      )}

                      {/* EXISTING FILE FEEDBACK */}
                      {existingDocs.gstCert && (
                        <div className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-md border w-fit transition-all ${selectedFileNames.gstFile ? "opacity-40 grayscale" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}>
                          <FiCheck />
                          <a href={existingDocs.gstCert} target="_blank" rel="noreferrer" className="underline hover:text-emerald-700">
                            {selectedFileNames.gstFile ? "Replacing current document" : "View Current GST"}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-400 italic">
                  * Uploading a new file will replace the existing document once you click Save.
                </p>
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
                <Input label="Bank Account Number" value={form.accountNumber || ""} placeholder="e.g. 123456789012"
                  onChange={e => setForm({ ...form, accountNumber: e.target.value })} required />
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