import React from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { useAuth } from "../context/AuthContext";
import "../styles.css"; // Ensure you have the updated CSS file

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // ✅ Initialize navigate function

  // ✅ Modified logout function to redirect to home page
  const handleLogout = () => {
    logout(); // Logs the user out
    navigate("/"); // Redirects to home page
  };

  return (
    <nav className="navbar">
      <div className="navbar-container" style={{ color: "black", fontStyle: "italic" }}>
        {/* Branding */}
        <Link className="navbar-brand" to="/"> <span style={{ marginLeft: "100px" }}>SpiceSecrets</span></Link>
        
        {/* Navigation Links */}
        <div className="nav-links">
          <Link className="nav-link" to="/recipes">Recipes</Link>
          {user && <Link className="nav-link" to="/favorites">Favorites</Link>}
          {user && <Link className="nav-link" to="/add-recipe">Add Recipe</Link>}
        </div>

        {/* Authentication Buttons */}
        <div className="auth-buttons">
          {user ? (
            <button 
              className="btn logout-btn" 
              style={{ color: "black", fontStyle: "italic" }} 
              onClick={handleLogout} // ✅ Use the updated logout function
            >
              Logout
            </button>
          ) : (
            <Link className="btn login-btn" to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
