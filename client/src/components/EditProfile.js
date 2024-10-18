import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/EditProfile.css'; // Import the new CSS file

const EditProfile = () => {
  const { username } = useParams(); 
  const [profileData, setProfileData] = useState({
    bio: '',
    profilePic: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/profile/${username}`, { withCredentials: true });
        setProfileData(response.data);
      } catch (error) {
        setMessage('Error loading profile data');
      }
    };

    fetchProfile();
  }, [username]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put(`http://localhost:4000/profile/${username}/edit`, profileData, { withCredentials: true });
      setMessage('Profile updated successfully');
      navigate(`/profile/${username}`);
    } catch (error) {
      setMessage('Error updating profile');
    }
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        <h2>Edit Profile</h2>
        {message && <p>{message}</p>}
        <div>
          <label>Bio:</label>
          <textarea
            name="bio"
            value={profileData.bio}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Profile Picture URL:</label>
          <input
            type="text"
            name="profilePic"
            value={profileData.profilePic}
            onChange={handleInputChange}
          />
        </div>
        <button onClick={handleSaveProfile}>Save Profile</button>
      </div>
    </div>
  );
};

export default EditProfile;
