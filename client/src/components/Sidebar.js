import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css'; // Create a CSS file for custom styles
import axios from 'axios'; // Import axios to handle the logout

const Sidebar = ({ username }) => {
  
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:4000/logout', {}, { withCredentials: true });
      window.location.href = '/login'; // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Welcome to MoonBook, {username}</h2>
      </div>
      <ul className="sidebar-links">
        <li>
          <Link to="/home">
            <i className="fas fa-home"></i> Home
          </Link>
        </li>
        <li>
          <Link to="/search">
            <i className="fas fa-search"></i> Search
          </Link>
        </li>
        <li>
          <Link to="/notifications">
            <i className="fas fa-bell"></i> Notifications
          </Link>
        </li>
        <li>
          <Link to="/create">
            <i className="fas fa-plus-circle"></i> Create
          </Link>
        </li>
        <li>
          <Link to={`/profile/${username}`}>
            <i className="fas fa-user-circle"></i> Profile
          </Link>
        </li>
        {/* Logout link */}
        <li>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Log out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
