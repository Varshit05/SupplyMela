import { useEffect, useState } from "react";
import api from "../api/vendorAxios";
import { useNavigate, Link } from "react-router-dom";
import { useVendorAuth } from "../context/vendorAuthContext";

const Register = () => {
  const [form, setForm] = useState({});
  const navigate = useNavigate();
  const { login } = useVendorAuth();

  useEffect(() => {
    if(window.google){
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleRegister"),
        { theme: "outline", size: "large", width: "100%", text: "signup_with"}
      );
    }
  }, []);

  const handleGoogleLogin = async (response) => {
    try {
      const res = await api.post("/auth/google-login", { token: response.credential });
      if(res.data.token){
        login(res.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Google registration failed", err);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      console.error("Registration failed", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      {/* Decorative gradient header */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-slate-900 to-slate-800 -z-10" />

      <div className="card w-full max-w-lg shadow-2xl border-none">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Vendor Registration</h2>
          <p className="text-slate-500 mt-2">Join our network and start selling your products.</p>
        </div>

        <form onSubmit={submit} className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input className="input" placeholder="John Doe" 
                onChange={e => setForm({...form, name:e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Email</label>
              <input className="input" type="email" placeholder="john@company.com"
                onChange={e => setForm({...form, email:e.target.value})} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Create Password</label>
            <input className="input" type="password" placeholder="At least 6 characters"
              onChange={e => setForm({...form, password:e.target.value})} required />
          </div>

          <div className="pt-4">
            <button className="btn btn-primary w-full py-3">
              Create Vendor Account
            </button>
          </div>
        </form>
          <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500">Or</span>
          </div>
        </div>
        <div id="googleRegister" className="w-full"></div>


        <p className="mt-8 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-500">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;