import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import Navbar from "../components/Navbar"; // ✅ Import Navbar

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !username || !email || !password) {
      setError("All fields are required!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! You can now log in.");
        navigate("/login");
      } else {
        setError(data.message || "Registration failed. Try again.");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      setError("An error occurred. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar /> {/* ✅ Added Navbar here */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 shadow-lg rounded-2xl w-96">
          <h2 className="text-2xl font-semibold text-center text-gray-800">Register</h2>

          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

          <form onSubmit={handleRegister} className="mt-4 space-y-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300 outline-none"
            />

            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300 outline-none"
            />

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300 outline-none"
            />

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
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already a member?{" "}
            <button onClick={() => navigate("/login")} className="text-indigo-600 font-semibold hover:underline">
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
