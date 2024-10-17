import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import the Sidebar component
import axios from 'axios';
import FollowersModal from './FollowersModal'; // Import the FollowersModal component
import FollowingModal from './FollowingModal'; // Import the FollowingModal component
import '../styles/Profile.css'; // CSS for styling the profile page

const Profile = () => {
  const { username } = useParams(); // Get the username from the route params
  const [profileData, setProfileData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);

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

  const openFollowersModal = () => {
    setIsFollowersModalOpen(true);
  };

  const closeFollowersModal = () => {
    setIsFollowersModalOpen(false);
  };

  const openFollowingModal = () => {
    setIsFollowingModalOpen(true);
  };

  const closeFollowingModal = () => {
    setIsFollowingModalOpen(false);
  };

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
              <span onClick={openFollowersModal} style={{ cursor: 'pointer' }}>
                <strong>{profileData.followersCount}</strong> followers
              </span>
              <span onClick={openFollowingModal} style={{ cursor: 'pointer' }}>
                <strong>{profileData.followingCount}</strong> following
              </span>
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

      {/* Render the FollowersModal only when the modal is open */}
      {isFollowersModalOpen && (
        <FollowersModal username={profileData.username} onClose={closeFollowersModal} />
      )}

      {/* Render the FollowingModal only when the modal is open */}
      {isFollowingModalOpen && (
        <FollowingModal username={profileData.username} onClose={closeFollowingModal} />
      )}
    </div>
  );
};

export default Profile;
