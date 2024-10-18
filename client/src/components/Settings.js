import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Settings.css'

const Settings = () => {
  const { username } = useParams(); // Get the username from the URL
  const navigate = useNavigate();   // For navigation after deletion

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // Send a DELETE request to the backend to delete the account
        const response = await axios.delete(`http://localhost:4000/register/${username}/delete`, { withCredentials: true });
        alert(response.data.message);
        
        // Redirect to /register after account deletion
        navigate('/register');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  const handleGoBack = () => {
    navigate(`/profile/${username}`); // Navigate back to the profile page
  };

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      <button className="back-btn" onClick={handleGoBack}>Back to Profile</button>
      <button className="delete-btn" onClick={handleDeleteAccount}>Delete Account</button>
    </div>
  );
};

export default Settings;
