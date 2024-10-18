import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'; // Import the sidebar
import SuggestedSidebar from './SuggestedSidebar'; // Import the suggested sidebar
import axios from 'axios';
import '../styles/Home.css'; // Add custom CSS for layout

const Home = () => {
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/home', { withCredentials: true });
        setUsername(response.data.username); // Set the username from the response
      } catch (error) {
        setErrorMessage('Failed to load user data');
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="home-container">
      <Sidebar username={username} /> 
      <div className="content">
        {errorMessage ? (
          <p style={{ color: 'red' }}>{errorMessage}</p>
        ) : (
          <h2>Welcome to the Home Page</h2>
        )}
      </div>
      <SuggestedSidebar /> {/* Add the suggested sidebar */}
    </div>
  );
};

export default Home;
