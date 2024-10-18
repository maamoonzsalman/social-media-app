// SuggestedSidebar.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/SuggestedSidebar.css'; // Add appropriate CSS

const SuggestedSidebar = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/home', { withCredentials: true });
        setSuggestedUsers(response.data.suggestedUsers);
      } catch (error) {
        console.error('Error fetching suggested users:', error);
      }
    };

    fetchSuggestedUsers();
  }, []);

  return (
    <div className="suggested-sidebar">
      <h3>Suggested for you</h3>
      {suggestedUsers.map(user => (
        <div key={user.id} className="suggested-user">
          <img 
            src={user.profilePic || '/default-profile.jpg'} 
            alt={`${user.username}'s profile`} 
            className="suggested-profile-pic"
          />
          <Link to={`/profile/${user.username}`}>
            {user.username}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SuggestedSidebar;
