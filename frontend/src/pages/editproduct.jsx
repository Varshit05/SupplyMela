import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/vendorAxios";
import { FiSave, FiArrowLeft, FiEdit3, FiImage, FiFileText } from "react-icons/fi";
import { toast } from "react-toastify";
import { Input, Textarea, Upload } from "../components/FormElements";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    type: "product",
    description: "",
    specifications: "",
    price: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [images, setImages] = useState([]);
  const [catalogue, setCatalogue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/${id}`).then(res => {
      const p = res.data;
      setForm({
        name: p.name,
        type: p.type,
        description: p.description || "",
        specifications: p.specifications || "",
        price: p.price,
      });
      setExistingImages(p.images || []);
      setLoading(false);
    }).catch(() => {
        toast.error("Could not fetch product details");
        navigate("/products");
    });
  }, [id, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));

    images.forEach(img => data.append("images", img));
    if (catalogue) data.append("catalogue", catalogue);

    try {
      await api.put(`/products/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product updated successfully");
      navigate("/products");
    } catch (err) {
      toast.error("Failed to update product");
    }
  };

  if (loading) return <EditProductSkeleton />;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate("/products")} 
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium"
        >
          <FiArrowLeft /> Back to Catalog
        </button>
      </div>

      <div className="card shadow-xl border-none p-8 md:p-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <FiEdit3 size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Edit {form.type === 'product' ? 'Product' : 'Service'}</h2>
            <p className="text-slate-500 text-sm font-medium">Modify details for "{form.name}"</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input 
                label="Product / Service Name" 
                value={form.name} 
                onChange={e => setForm({ ...form, name: e.target.value })} 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Type</label>
              <select 
                className="input" 
                value={form.type} 
                onChange={e => setForm({ ...form, type: e.target.value })}
              >
                <option value="product">Product</option>
                <option value="service">Service</option>
              </select>
            </div>

            <Input 
              label="Price (INR)" 
              type="number" 
              value={form.price} 
              onChange={e => setForm({ ...form, price: e.target.value })} 
              required 
            />
          </div>

          <Textarea 
            label="Description" 
            value={form.description} 
            onChange={e => setForm({ ...form, description: e.target.value })} 
          />

          <Textarea 
            label="Technical Specifications" 
            value={form.specifications} 
            onChange={e => setForm({ ...form, specifications: e.target.value })} 
          />

          {/* Current Gallery Section */}
          {existingImages.length > 0 && (
            <div className="pt-6 border-t border-slate-100">
              <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <FiImage className="text-indigo-500" /> Current Image Gallery
              </p>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={img}
                      alt={`Product ${i}`}
                      className="w-24 h-24 rounded-xl object-cover border-2 border-slate-100 shadow-sm transition-transform group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
            <Upload 
              label="Replace Images" 
              multiple 
              onChange={e => setImages([...e.target.files])} 
            />
            <Upload 
              label="Update Catalogue (PDF)" 
              accept="application/pdf" 
              onChange={e => setCatalogue(e.target.files[0])} 
            />
          </div>

          <div className="pt-4">
            <button className="btn btn-primary w-full py-4 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
              <FiSave /> Update Product Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* Reuse the Input, Textarea, and Upload components from Profile.jsx */

const EditProductSkeleton = () => (
  <div className="max-w-4xl mx-auto space-y-6 animate-pulse p-6">
    <div className="h-6 bg-slate-200 rounded w-24"></div>
    <div className="card h-96 bg-white border border-slate-100"></div>
  </div>
);

export default EditProduct;