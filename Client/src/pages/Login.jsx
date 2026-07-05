import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email,
                    password,
                }
            );
            localStorage.setItem("token", response.data.token);
            alert(response.data.message);

        } catch (error) {
            alert(error.response.data.message);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-center text-slate-800">
                    Welcome Back 👋
                </h1>
                <p className="text-slate-500 text-center mt-2">
                    Sign in to continue managing your tasks.
                </p>
                <form onSubmit={handleLogin}>
                    <label className="block text-sm font-medium text-slate-700 mt-8">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-2 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="block text-sm font-medium text-slate-700 mt-8">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mt-2 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 mt-6 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold"
                    >
                        Login
                    </button>
                    <p className="text-center text-slate-600 mt-6">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
export default Login;