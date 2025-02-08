import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import Navbar from "../components/Navbar"; // ✅ Import Navbar

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user && data.user.username) {
          localStorage.setItem("token", data.token);
          login({ username: data.user.username, email: data.user.email });
          navigate("/recipes");
        } else {
          setError("Login successful, but username is missing. Please contact support.");
        }
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("An error occurred. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar /> {/* ✅ Navbar added here */}

      {/* Main Content Wrapper */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white p-8 shadow-lg rounded-2xl w-96">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">Login</h2>

          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

          <form onSubmit={handleLogin} className="mt-2 space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300 outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300 outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition ${
                loading && "opacity-50 cursor-not-allowed"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-2">
            New user?{" "}
            <button onClick={() => navigate("/")} className="text-indigo-600 font-semibold hover:underline">
            Register
          </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

