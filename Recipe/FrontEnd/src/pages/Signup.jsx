import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios for API calls
import { useAuth } from "../context/AuthContext"; // Import Auth Context
import "../styles.css"; // Import external CSS file

const API_BASE_URL = "http://localhost:5000/api"; // Update this with your backend URL

function Signup() {
  const { setUser, setToken } = useAuth(); // ✅ Ensure useAuth provides setUser & setToken
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Signup API Response:", response.data); // Debugging log

      if (response.data.success) {
        // ✅ Store user and token in Context & Local Storage
        setUser(response.data.user);
        setToken(response.data.token);

        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);

        console.log("User & Token Set, Redirecting..."); // Debugging log

        // ✅ Redirect to profile page after signup
        navigate("/profile");
      } else {
        setError(response.data.msg || "Signup failed! Please try again.");
      }
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
      setError(err.response?.data?.msg || "Signup failed! Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">📝 Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" onChange={handleChange} required className="auth-input" />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="auth-input" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="auth-input" />
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
