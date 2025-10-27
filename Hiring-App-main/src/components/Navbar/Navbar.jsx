import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import logo from "../../assets/cit_white_logo.webp";
import "./navbar.css";
import Sidebar from "../SideBar/Sidebar";

const Navbar = ({ isAuthorized }) => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  const handleLogin = async () => {
    try {
      await loginWithRedirect({
        authorizationParams: {
          prompt: "login", // ✅ Forces Gmail login every time
        },
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    // Clear cookies to prevent automatic login
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });

    window.location.href = "http://localhost:3000"; // Redirect without Auth0 logout
  };

  return (
    <nav className="navbar">
      <div className="nav_logo">
        <Link to="/" className="nav_logo">
          <img src={logo} className="nav-img" alt="Logo" />
        </Link>
      </div>

      {isAuthenticated && isAuthorized ? (
        <>
          <Link to="/hr-dashboard" className="nav_btn">Home</Link>
          <Link to="/hr-dashboard/profile" className="nav_btn">Profile</Link>
          <Link to="/hr-dashboard/create-job" className="nav_btn">Create Job</Link>
          <Sidebar />
        </>
      ) : isAuthenticated ? (
        <Link to="/" className="nav_btn">Candidate Portal</Link>
      ) : null}

      <button onClick={isAuthenticated ? handleLogout : handleLogin} className="logout_btn">
        {isAuthenticated ? "Logout" : "Login"}
      </button>
    </nav>
  );
};

export default Navbar;
