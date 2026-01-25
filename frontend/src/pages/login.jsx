import { useState } from "react";
import api from "../api/vendorAxios";
import { useVendorAuth } from "../context/vendorAuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({});
  const { login, token } = useVendorAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-indigo-600 -z-10" />
      
      <div className="card w-full max-w-md shadow-2xl border-none">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Sign in to manage your vendor account</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              className="input"
              type="email"
              placeholder="name@company.com"
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button className="btn btn-primary w-full py-3 mt-2">
            Sign In
          </button>
        </form>

        {!token && (
          <p className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-500">
              Register your business
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;