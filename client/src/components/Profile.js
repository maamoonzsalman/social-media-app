import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import the Sidebar component
import axios from 'axios';
import '../styles/Profile.css'; // CSS for styling the profile page

const Profile = () => {
  const { username } = useParams(); // Get the username from the route params
  const [profileData, setProfileData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/profile/${username}`, { withCredentials: true });
        setProfileData(response.data);
      } catch (error) {
        setErrorMessage('Error loading profile');
      }
    };

    fetchProfile();
  }, [username]);

  if (!profileData) {
    return <p>{errorMessage || 'Loading profile...'}</p>;
  }

  return (
    <div className="profile-page">
      <Sidebar username={profileData.username} /> {/* Use existing sidebar */}
      <div className="profile-content">
        <div className="profile-header">
          <img
            src={profileData.profilePicture || '/default-profile.jpg'}
            alt={`${profileData.username}'s profile`}
            className="profile-picture"
          />
          <div className="profile-info">
            <h2>{profileData.username}</h2>
            <div className="profile-stats">
              <span><strong>{profileData.postCount}</strong> posts</span>
              <span><strong>{profileData.followersCount}</strong> followers</span>
              <span><strong>{profileData.followingCount}</strong> following</span>
            </div>
          </div>
        </div>

        {profileData.posts.length > 0 ? (
          <div className="profile-posts">
            {profileData.posts.map(post => (
              <div key={post.id} className="post">
                <img src={post.image} alt="Post" />
              </div>
            ))}
          </div>
        ) : (
          <p>No posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
