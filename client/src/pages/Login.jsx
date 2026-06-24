import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
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
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <form
        onSubmit={loginUser}
        className="bg-gray-800 p-8 rounded w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-700 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 rounded bg-gray-700 outline-none"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 p-3 rounded hover:bg-blue-700"
        >
          Login
        </button>

        <p className="mt-4 text-gray-400">
          No account?
          <Link to="/register" className="text-blue-400 ml-2">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
