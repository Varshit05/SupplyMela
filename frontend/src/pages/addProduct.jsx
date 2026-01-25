import { useState } from "react";
import api from "../api/vendorAxios";
import { useNavigate } from "react-router-dom";
import { FiSave, FiArrowLeft, FiPackage, FiUploadCloud } from "react-icons/fi";
import { toast } from "react-toastify";
import { Input, Textarea, Upload } from "../components/FormElements";

const AddProduct = () => {
  const [form, setForm] = useState({ name: "", type: "product", description: "", specifications: "", price: "" });
  const [images, setImages] = useState([]);
  const [catalogue, setCatalogue] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    images.forEach(img => data.append("images", img));
    if (catalogue) data.append("catalogue", catalogue);

    try {
      await api.post("/products", data);
      toast.success("Product added successfully");
      navigate("/products");
    } catch (err) {
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium">
        <FiArrowLeft /> Back to List
      </button>

      <div className="card shadow-xl border-none p-8 md:p-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <FiPackage size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Add New Item</h2>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input label="Product / Service Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Type</label>
              <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="product">Product</option>
                <option value="service">Service</option>
              </select>
            </div>

            <Input label="Price (INR)" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
          </div>

          <Textarea label="Short Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <Textarea label="Specifications / Technical Details" value={form.specifications} onChange={e => setForm({ ...form, specifications: e.target.value })} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <Upload label="Product Images" multiple onChange={e => setImages([...e.target.files])} />
            <Upload label="Catalogue (PDF)" accept="application/pdf" onChange={e => setCatalogue(e.target.files[0])} />
          </div>

          <button disabled={loading} className="btn btn-primary w-full py-4 mt-4 shadow-lg shadow-indigo-200">
            {loading ? "Processing..." : <><FiSave /> Save to Catalog</>}
          </button>
        </form>
      </div>
    </div>
  );
};

// Re-use the Input, Textarea, and Upload components defined in your Profile.jsx 
// You can move them to a separate /components/UI.jsx file to share them across the app!

export default AddProduct;