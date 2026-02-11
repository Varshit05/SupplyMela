import { FiUploadCloud } from "react-icons/fi";

export const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
    <input 
      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 
                 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" 
      {...props} 
    />
  </div>
);

export const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
    <textarea 
      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 
                 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none min-h-[100px] resize-none" 
      {...props} 
    />
  </div>
);

export const Upload = ({ label, required, ...props }) => {
  // Check if files are selected to update the UI text
  const fileCount = props.files?.length || 0;
  const fileName = fileCount === 1 ? props.files[0].name : `${fileCount} files selected`;

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <div className="relative group">
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          {...props}
          required={required}
        />
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex items-center gap-3 bg-slate-50 group-hover:bg-slate-100 group-hover:border-indigo-300 transition-all">
          <div className={`p-2 rounded-lg shadow-sm ${fileCount > 0 ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 group-hover:text-indigo-600'}`}>
            <FiUploadCloud size={20} />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-slate-700">
              {fileCount > 0 ? fileName : "Choose file"}
            </p>
            <p className="text-xs text-slate-400">PDF, JPG up to 10MB</p>
          </div>
        </div>
      </div>
    </div>
  );
};