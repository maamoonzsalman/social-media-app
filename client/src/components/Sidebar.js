import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css'; // Create a CSS file for custom styles

const Sidebar = ({ username }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        {/* Display "Welcome to MoonBook, <username>" */}
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
          <Link to="/profile">
            <i className="fas fa-user-circle"></i> Profile
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
