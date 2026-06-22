import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const registerUser = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/");
    } catch (error) {
      console.error(error);

      alert("Register failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <form
        onSubmit={registerUser}
        className="bg-gray-800 p-8 rounded w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6">Register</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-700 outline-none"
        />

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
          className="w-full bg-green-600 p-3 rounded hover:bg-green-700"
        >
          Register
        </button>

        <p className="mt-4 text-gray-400">
          Already have an account?
          <Link to="/login" className="text-blue-400 ml-2">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
