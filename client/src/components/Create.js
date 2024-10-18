import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar'; // Ensure the correct path
import axios from 'axios';

const Create = () => {
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
    <div>
      <Sidebar username={username} /> {/* Pass the username to the sidebar */}
      <div className="create-content">
        {errorMessage ? (
          <p style={{ color: 'red' }}>{errorMessage}</p>
        ) : (
          <h2>Create something here</h2>
        )}
      </div>
    </div>
  );
};

export default Create;

