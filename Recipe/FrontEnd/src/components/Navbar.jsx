import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles.css"; // Ensure you have the updated CSS file

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container" style={{ color: "black", fontStyle: "italic" }}>
        {/* Branding */}
        <Link className="navbar-brand" to="/"> <span style={{marginLeft:"100px"}}>SpiceSecrets </span></Link>
        
        {/* Navigation Links */}
        <div className="nav-links">
          <Link className="nav-link" to="/recipes">Recipes</Link>
          {user && <Link className="nav-link" to="/favorites">Favorites</Link>}
          {user && <Link className="nav-link" to="/add-recipe">Add Recipe</Link>}
        </div>

        {/* Authentication Buttons */}
        <div className="auth-buttons" >
          {user ? (
            <button className="btn logout-btn"style={{ color: "black", fontStyle: "italic" }} onClick={logout}>Logout</button>
          ) : (
            <Link className="btn login-btn" to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
