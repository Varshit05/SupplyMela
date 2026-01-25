// components/cards/ProductCard.jsx
import { FiEdit3, FiTrash2, FiExternalLink, FiPackage, FiTool } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="card group flex flex-col h-full border-slate-200 hover:border-indigo-200 transition-all">
      {/* Header & Badge */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          {product.type === 'product' ? <FiPackage className="text-indigo-500" /> : <FiTool className="text-violet-500" />}
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            {product.type}
          </span>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => navigate(`/products/edit/${product._id}`)}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <FiEdit3 size={18} />
          </button>
          <button 
            onClick={() => onDelete(product._id)}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4">
          {product.description}
        </p>

        {/* Image Gallery */}
        {product.images?.length > 0 && (
          <div className="flex gap-2 mb-4 overflow-hidden">
            {product.images.slice(0, 3).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt=""
                className="w-14 h-14 object-cover rounded-xl border border-slate-100 shadow-sm"
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
        <div>
          <span className="text-xs text-slate-400 block font-medium uppercase">Price</span>
          <span className="text-lg font-bold text-slate-900">₹ {product.price}</span>
        </div>
        {product.catalogue && (
          <a
            href={product.catalogue}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-indigo-600 font-semibold text-sm hover:text-indigo-700"
          >
            Catalogue <FiExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
};

export default ProductCard;