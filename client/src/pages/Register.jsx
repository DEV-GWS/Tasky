import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function Register({theme}) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const registerUser = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          username,
          email,
          password,
        },
      );
      localStorage.setItem("token", res.data.token);
      navigate("/");

      toast.success("Account created 🎉");
    } catch (error) {
      toast.error("Account creation failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <form
        onSubmit={registerUser}
        className={`w-full max-w-md rounded-3xl border p-8 shadow-xl transition-all duration-300 ${
          theme === "dark"
            ? "bg-[#111827] border-gray-800"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Create Account 🚀
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Start organizing your productivity journey
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full p-3 rounded-xl outline-none border transition focus:ring-2 focus:ring-green-500 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                : "bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500"
            }`}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-3 rounded-xl outline-none border transition focus:ring-2 focus:ring-green-500 ${
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
            className={`w-full p-3 rounded-xl outline-none border transition focus:ring-2 focus:ring-green-500 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                : "bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500"
            }`}
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition active:scale-95"
        >
          Register
        </button>

        <p className="mt-6 text-sm text-center text-gray-500">
          Already have an account?
          <Link
            to="/login"
            className="text-blue-500 hover:text-blue-600 ml-2 font-medium"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
