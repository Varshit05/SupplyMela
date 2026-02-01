import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/vendorAxios";
import { FiSave, FiArrowLeft, FiEdit3, FiImage, FiX, FiTrash2, FiFileText, FiLoader } from "react-icons/fi";
import { toast } from "react-toastify";
import { Input, Textarea, Upload } from "../components/FormElements";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form States
  const [form, setForm] = useState({
    name: "",
    type: "product",
    description: "",
    specifications: "",
    price: "",
  });

  // Image Management States
  const [existingImages, setExistingImages] = useState([]); // Images currently on server
  const [deletedImages, setDeletedImages] = useState([]);   // URLs to be removed on Save
  const [images, setImages] = useState([]);                 // New File objects to upload
  const [previews, setPreviews] = useState([]);             // Local preview URLs for new files
  
  const [catalogue, setCatalogue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch Product Data
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

  // Handle New Image Selection
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages(prev => [...prev, ...selectedFiles]);

    // Create temporary URLs for previewing new uploads
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    e.target.value = null; // Reset input
  };

  // Remove a newly selected (not yet uploaded) image
  const removeNewImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  // Delete an existing image from the server (with Alert)
  const handleRemoveExisting = (imgUrl) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image? This change will be permanent once you save."
    );

    if (confirmDelete) {
      setDeletedImages(prev => [...prev, imgUrl]);
      setExistingImages(prev => prev.filter(img => img !== imgUrl));
      toast.info("Image marked for deletion");
    }
  };

  // Submit Form
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = new FormData();
    
    // 1. Add basic form fields
    Object.entries(form).forEach(([k, v]) => data.append(k, v));

    // 2. Add new image files
    images.forEach(img => data.append("images", img));
    
    // 3. Add list of images to delete (Backend should handle this array)
    data.append("deletedImages", JSON.stringify(deletedImages));

    // 4. Add catalogue if changed
    if (catalogue) data.append("catalogue", catalogue);

    try {
      await api.put(`/products/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product updated successfully");
      navigate("/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <EditProductSkeleton />;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 animate-in fade-in duration-500">
      {/* Back Button */}
      <button 
        onClick={() => navigate("/products")} 
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium"
      >
        <FiArrowLeft /> Back to Catalog
      </button>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <FiEdit3 size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Edit {form.type}</h2>
            <p className="text-slate-500 text-sm">Update details for "{form.name}"</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input 
                label="Product Name" 
                value={form.name} 
                onChange={e => setForm({ ...form, name: e.target.value })} 
                required 
              />
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

          {/* Combined Image Gallery */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
              <FiImage className="text-indigo-500" /> Product Gallery
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {/* Existing Images */}
              {existingImages.map((img, i) => (
                <div key={`old-${i}`} className="relative group aspect-square">
                  <img src={img} className="w-full h-full object-cover rounded-xl border-2 border-white shadow-sm transition-all group-hover:brightness-50" alt="product" />
                  <button
                    type="button"
                    onClick={() => handleRemoveExisting(img)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white transition-opacity"
                  >
                    <FiTrash2 size={24} className="drop-shadow-md" />
                  </button>
                  <div className="absolute top-1 left-1 bg-green-500 w-2 h-2 rounded-full border border-white"></div>
                </div>
              ))}

              {/* New Previews */}
              {previews.map((url, i) => (
                <div key={`new-${i}`} className="relative aspect-square group">
                  <img src={url} className="w-full h-full object-cover rounded-xl border-2 border-indigo-400 shadow-md" alt="preview" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
                  >
                    <FiX size={14} />
                  </button>
                  <div className="absolute top-1 left-1 bg-indigo-500 w-2 h-2 rounded-full border border-white animate-pulse"></div>
                </div>
              ))}

              {/* Empty state if no images */}
              {existingImages.length === 0 && previews.length === 0 && (
                <div className="col-span-full py-8 text-center text-slate-400 text-sm italic">
                  No images uploaded yet.
                </div>
              )}
            </div>
          </div>

          {/* Upload Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
            <Upload 
              label="Add More Images" 
              multiple 
              files={images}
              onChange={handleImageChange} 
            />
            <Upload 
              label="Update Catalogue (PDF)" 
              accept="application/pdf" 
              files={catalogue ? [catalogue] : []}
              onChange={e => setCatalogue(e.target.files[0])} 
            />
          </div>

          {/* Save Button */}
          <div className="pt-4">
    <button 
      disabled={saving}
      className={`w-full py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all 
        ${saving 
          ? "bg-slate-400 cursor-not-allowed text-white" 
          : "bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98] shadow-indigo-100"
        }`}
    >
      {saving ? (
        <>
          <FiLoader className="animate-spin" size={20} />
          Updating Product...
        </>
      ) : (
        <>
          <FiSave size={20} />
          Update Product & Gallery
        </>
      )}
    </button>
  </div>
        </form>
      </div>
    </div>
  );
};

const EditProductSkeleton = () => (
  <div className="max-w-4xl mx-auto space-y-6 animate-pulse p-6">
    <div className="h-6 bg-slate-200 rounded w-24 mb-4"></div>
    <div className="h-[600px] bg-white rounded-2xl border border-slate-100"></div>
  </div>
);

export default EditProduct;