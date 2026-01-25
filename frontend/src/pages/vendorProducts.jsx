import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/vendorAxios";
import ProductCard from "../cards/productCard";
import { FiPlus, FiShoppingBag } from "react-icons/fi";

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/products").then(res => setProducts(res.data));
  }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    await api.delete(`/products/${id}`);
    setProducts(products.filter(p => p._id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Products & Services</h2>
          <p className="text-slate-500 mt-1">Manage your catalog and service offerings.</p>
        </div>
        {products.length > 0 && (
          <button onClick={() => navigate("/products/add")} className="btn btn-primary">
            <FiPlus className="text-lg" /> Add New Item
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      {products.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 text-center border-dashed border-2 border-slate-200 bg-transparent">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
            <FiShoppingBag size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No products found</h3>
          <p className="text-slate-500 mt-1 mb-6">Start by adding your first product or service to the catalog.</p>
          <button onClick={() => navigate("/products/add")} className="btn btn-primary px-8">
            Create First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {products.map(product => (
            <ProductCard key={product._id} product={product} onDelete={deleteProduct} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorProducts;