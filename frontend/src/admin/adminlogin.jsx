// admin/AdminLogin.jsx
import { useState } from "react";
import api from "../api/adminAxios";
import { useAdminAuth } from "../context/AdminAuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiShield, FiMail, FiLock, FiChevronRight } from "react-icons/fi";
import { Input } from "../components/FormElements"; // Reusing our shared UI component

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await api.post("/auth/admin/login", { email, password });
      login(res.data.token);
      toast.success("Welcome back, Administrator");
      navigate("/admin");
    } catch (err) {
      toast.error("Invalid administrator credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl -ml-48 -mb-48"></div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-2xl mb-4 shadow-2xl shadow-indigo-500/20">
            <FiShield size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Admin Control</h2>
          <p className="text-slate-400 mt-2">Authorized personnel access only</p>
        </div>

        <div className="card bg-slate-900 border-slate-800 p-8 shadow-2xl">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5 flex items-center gap-2">
                <FiMail className="text-indigo-400" /> Admin Email
              </label>
              <input
                type="email"
                placeholder="admin@system.com"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5 flex items-center gap-2">
                <FiLock className="text-indigo-400" /> Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn btn-primary py-4 bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center gap-2 group mt-2"
            >
              {isSubmitting ? "Authenticating..." : (
                <>
                  Secure Login <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
             <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">
               Encrypted Session
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;