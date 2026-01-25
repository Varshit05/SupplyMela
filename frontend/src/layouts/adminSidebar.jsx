import { NavLink, useNavigate } from "react-router-dom";
import { FiUsers, FiShield, FiLogOut, FiLayout } from "react-icons/fi";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminSidebar = () => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
      isActive 
      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20" 
      : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <div className="w-72 bg-slate-950 text-white min-h-screen flex flex-col p-6 border-r border-slate-800">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-indigo-500/20 shadow-xl">
          <FiShield className="text-xl" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Admin<span className="text-indigo-500">Panel</span></h2>
      </div>

      <nav className="space-y-2 flex-1">
        <NavLink to="/admin" end className={linkStyle}>
          <FiLayout size={20} /> Dashboard
        </NavLink>
        {/* <NavLink to="/admin/kyc" className={linkStyle}>
          <FiShield size={20} /> KYC Requests
        </NavLink>
        <NavLink to="/admin/vendors" className={linkStyle}>
          <FiUsers size={20} /> Vendor List
        </NavLink> */}
      </nav>

      <button 
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all font-medium"
      >
        <FiLogOut size={20} /> Logout Account
      </button>
    </div>
  );
};

export default AdminSidebar;