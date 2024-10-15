import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'; // Make sure the path is correct
import axios from 'axios';

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
    <div className="home">
      <Sidebar username={username} /> 
      <div className="content">
        {errorMessage ? (
          <p style={{ color: 'red' }}>{errorMessage}</p>
        ) : (
          <h2></h2>
        )}
      </div>
    </div>
  );
};

export default Home;
