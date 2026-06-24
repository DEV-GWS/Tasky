import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login({theme}) {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.custom("Already Logged in");
        navigate("/");
      } catch (error) {
        localStorage.removeItem("token");
      }
    };

    verifyUser();
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email,
          password,
        },
      );
      localStorage.setItem("token", res.data.token);
      toast.success("Logged in successfully");
      window.location.href = "/";
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <form
        onSubmit={loginUser}
        className={`w-full max-w-md rounded-3xl border p-8 shadow-xl transition-all duration-300 ${
          theme === "dark"
            ? "bg-[#111827] border-gray-800"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back 👋</h1>

          <p className="text-sm text-gray-500 mt-2">
            Login to continue managing your tasks
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-3 rounded-xl outline-none border transition focus:ring-2 focus:ring-blue-500 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                : "bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500"
            }`}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-3 rounded-xl outline-none border transition focus:ring-2 focus:ring-blue-500 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                : "bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500"
            }`}
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition active:scale-95"
        >
          Login
        </button>

        <p className="mt-6 text-sm text-center text-gray-500">
          No account?
          <Link
            to="/register"
            className="text-blue-500 hover:text-blue-600 ml-2 font-medium"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
