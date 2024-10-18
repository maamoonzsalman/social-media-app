import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'; // Import Sidebar component
import axios from 'axios'; // Import axios


const Notifications = () => {
  const [loggedInUsername, setLoggedInUsername] = useState(null);

  useEffect(() => {
    // Fetch the logged-in user's username for Sidebar
    const fetchLoggedInUser = async () => {
      try {
        const response = await axios.get('http://localhost:4000/home', { withCredentials: true });
        setLoggedInUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching logged-in user:', error);
      }
    };

    fetchLoggedInUser();
  }, []);

  return (
    <div className="notifications-page">
      <Sidebar username={loggedInUsername} /> {/* Sidebar on the left */}
    </div>
  );
};

export default Notifications;
