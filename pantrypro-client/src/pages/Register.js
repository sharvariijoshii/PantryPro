import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState(""); // Ensure username is defined
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !username || !email || !password) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, username, email, password }),
      });

      const data = await response.json();
      console.log("Response from server:", data);

      if (response.ok) {
        alert("Registration successful! You can now log in.");
        navigate("/login"); // Redirect to login after successful registration
      } else {
        alert(data.message || "Registration failed. Try again.");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Username" // 🔹 Username input field added
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>

      <p>
        Already a member? <button onClick={() => navigate("/login")}>Login</button>
      </p>
    </div>
  );
};

export default Register;
