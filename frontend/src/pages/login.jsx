import { useEffect, useState } from "react";
import api from "../api/vendorAxios";
import { useVendorAuth } from "../context/vendorAuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [form, setForm] = useState({});
  const { login, token } = useVendorAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if(window.google){
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignIn"),
        { theme: "outline", size: "large", width: "100%"}
      );
    }
  }, []);

  const handleGoogleLogin = async (response) => {
    try {
      const res = await api.post("/auth/google-login", { token: response.credential });
      login(res.data.token, res.data.refreshToken);
      toast.success("Welcome to SupplyMela");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Google login failed");
      console.error("Google login failed", err);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.token, res.data.refreshToken);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
      console.error("Login failed", err);
    } finally {
      setIsSubmitting(false);
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

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn btn-primary w-full py-3 mt-2"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500">Or</span>
          </div>
        </div>

        <div id="googleSignIn" className="w-full"></div>
        

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