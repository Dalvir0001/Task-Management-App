import api from "../api/axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";

const Mail = ({ size = 18, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 5L2 7" />
    </svg>
);

const Lock = ({ size = 18, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const Eye = ({ size = 18, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOff = ({ size = 18, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 11 7 11 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 1 12s4 7 11 7a9.926 9.926 0 0 0 5.39-1.61" />
        <path d="M2 2l20 20" />
    </svg>
);

const Loader2 = ({ size = 18, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

// Task manager logo mark — swap the initials/name below for your own branding
const LogoMark = ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="12" fill="url(#logo-gradient)" />
        <path
            d="M12 20.5l5 5 11-11"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <defs>
            <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3B82F6" />
                <stop offset="1" stopColor="#06B6D4" />
            </linearGradient>
        </defs>
    </svg>
);

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please fill in all fields.");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email.");
            return;
        }
        try {
            setIsLoading(true);
            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password,
                }
            );
            localStorage.setItem("token", response.data.token);
            toast.success("Login successful!");
            navigate("/dashboard");

        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-100 to-cyan-100 px-4 relative overflow-hidden">
            {/* Ambient decorative blobs */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-300/30 rounded-full blur-3xl animate-pulse" />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-white/70 backdrop-blur-lg shadow-2xl border border-white/50 rounded-2xl p-8 relative transition-all duration-300 hover:shadow-[0_25px_60px_-15px_rgba(59,130,246,0.35)]"
            >

                <div className="flex flex-col items-center gap-2">
                    <LogoMark size={44} />
                    <span className="text-lg font-bold tracking-tight text-slate-800">
                        Task<span className="text-blue-600">ly</span>
                    </span>
                </div>

                <h1 className="text-4xl font-extrabold text-center text-slate-800 mt-6">
                    Welcome Back 👋
                </h1>
                <p className="text-slate-500 text-center mt-2">
                    Manage your tasks efficiently and stay productive every day.
                </p>
                <form onSubmit={handleLogin}>
                    <label className="block text-sm font-medium text-slate-700 mt-8">
                        Email
                    </label>
                    <div className="relative mt-2 group">
                        <Mail
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-blue-600"
                        />
                        <input
                            autoFocus
                            type="email"
                            placeholder="Enter your email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg bg-white/60 outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white hover:border-slate-400"
                        />
                    </div>

                    <label className="block text-sm font-medium text-slate-700 mt-6">
                        Password
                    </label>
                    <div className="relative mt-2 group">
                        <Lock
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-blue-600"
                        />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-11 py-3 border border-slate-300 rounded-lg bg-white/60 outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white hover:border-slate-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                            tabIndex={-1}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 mt-6 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                🚀 Login
                            </>
                        )}
                    </button>

                    <div className="mt-5">
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                try {
                                    const response = await api.post(
                                        "/auth/google",
                                        {
                                            credential: credentialResponse.credential,
                                        }
                                    );

                                    localStorage.setItem("token", response.data.token);

                                    toast.success(response.data.message);

                                    navigate("/dashboard");

                                } catch (error) {
                                    toast.error(
                                        error.response?.data?.message || "Google Login Failed"
                                    );
                                }
                            }}
                            onError={() => {
                                toast.error("Google Login Failed");
                            }}
                        />
                    </div>

                    <p className="text-center text-slate-600 mt-6">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                        >
                            Create Account →
                        </Link>
                    </p>
                </form>
                <p className="text-center text-xs text-slate-400 mt-8">
                    Built with ❤️ by Dalvir using React, Express & MongoDB
                </p>
            </motion.div>
        </div>
    );
}

export default Login;