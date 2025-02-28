import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = "http://localhost:5000/api"; // Update this with your backend URL

  // Redirect to login if no user is authenticated
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      axios
        .get(`${API_BASE_URL}/users/${storedUser.username}`)
        .then((response) => {
          setProfile(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
          setLoading(false);
        });
    }
  }, [navigate]);
  
  if (loading) {
    return <div className="text-center mt-5">Loading profile...</div>;
  }

  return (
    <div
      className="container-fluid d-flex flex-column justify-content-center align-items-center text-white"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/8205144/pexels-photo-8205144.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {/* Welcome Section */}
      <div className="text-center mb-4" style={{ color: "black", fontStyle: "italic" }}>
        <h1>Welcome, {profile?.name} 👋</h1>
        <p>Email: {profile?.email}</p>
      </div>

      {/* Profile Card */}
      <div
        className="card p-4 text-dark"
        style={{
          maxWidth: "500px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "10px",
          color: "black",
          fontStyle: "italic",
        }}
      >
        <h2 className="text-center">Your Profile</h2>
        <p>
          <strong>Name:</strong> {profile?.name}
        </p>
        <p>
          <strong>Email:</strong> {profile?.email}
        </p>
        <p>
          <strong>Joined:</strong> {new Date(profile?.joined).toDateString()}
        </p>
        <button className="btn btn-danger mt-3" onClick={logout}>
          Logout
        </button>
      </div>

      {/* Suggested Content for Engagement */}
      <div className="mt-5 text-center" style={{ maxWidth: "600px", color: "black", fontStyle: "italic" }}>
        <h3>🍽️ Discover New Flavors!</h3>
        <p>
          Explore a world of mouth-watering recipes from different cuisines.
          Try something <strong>new today</strong> and bring excitement to your kitchen!
        </p>
        <h4>🔥 Trending Recipes</h4>
        <p>Check out what's popular and see what others are cooking!</p>
        <button className="btn btn-warning mt-2" onClick={() => navigate("/recipes")}>
          Browse Recipes
        </button>
      </div>
    </div>
  );
};

export default Profile;
