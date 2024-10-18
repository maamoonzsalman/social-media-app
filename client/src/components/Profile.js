import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import axios from 'axios';
import FollowersModal from './FollowersModal';
import FollowingModal from './FollowingModal';
import '../styles/Profile.css'; // Ensure your CSS is updated accordingly

const Profile = () => {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileResponse = await axios.get(`http://localhost:4000/profile/${username}`, { withCredentials: true });
        setProfileData(profileResponse.data);
      } catch (error) {
        setErrorMessage('Error loading profile');
      }

      try {
        const loggedInUserResponse = await axios.get('http://localhost:4000/home', { withCredentials: true });
        setLoggedInUser(loggedInUserResponse.data.username);
      } catch (error) {
        setLoggedInUser(null);
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
      <Sidebar username={profileData.username} />
      <div className="profile-content">
        <div className="profile-header">
          <img
            src={profileData.profilePicture || '/default-profile.jpg'}
            alt={`${profileData.username}'s profile`}
            className="profile-picture"
          />
          <div className="profile-info">
            <div className="profile-header-top">
              <h2>{profileData.username}</h2>

              {loggedInUser === profileData.username && (
                <button
                  className="edit-profile-btn"
                  onClick={() => navigate(`/profile/${username}/edit`)}
                >
                  Edit Profile
                </button>
              )}

              {/* If the profile is not the logged-in user's profile, show Follow button */}
              {loggedInUser !== profileData.username && (
                <button className="follow-btn">Follow</button>
              )}
            </div>

            <div className="profile-stats">
              <span><strong>{profileData.postCount}</strong> posts</span>
              <span onClick={openFollowersModal} style={{ cursor: 'pointer' }}>
                <strong>{profileData.followersCount}</strong> followers
              </span>
              <span onClick={openFollowingModal} style={{ cursor: 'pointer' }}>
                <strong>{profileData.followingCount}</strong> following
              </span>
            </div>

            {/* Display bio if it exists */}
            {profileData.bio && <p className="profile-bio">{profileData.bio}</p>}
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

      {isFollowersModalOpen && (
        <FollowersModal username={profileData.username} onClose={closeFollowersModal} />
      )}

      {isFollowingModalOpen && (
        <FollowingModal username={profileData.username} onClose={closeFollowingModal} />
      )}
    </div>
  );
};

export default Profile;
