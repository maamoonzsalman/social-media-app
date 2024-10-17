import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import axios from 'axios';
import FollowersModal from './FollowersModal';
import FollowingModal from './FollowingModal';
import '../styles/Profile.css';

const Profile = () => {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false); // Track follow status
  const [loggedInUserFollowingCount, setLoggedInUserFollowingCount] = useState(0); // Track logged-in user's following count
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

        // Fetch the logged-in user's following count
        const loggedInUserProfileResponse = await axios.get(`http://localhost:4000/profile/${loggedInUserResponse.data.username}`, { withCredentials: true });
        setLoggedInUserFollowingCount(loggedInUserProfileResponse.data.followingCount);

        // Check if the logged-in user is already following the profile
        const followStatusResponse = await axios.get(`http://localhost:4000/profile/${username}/isFollowing`, { withCredentials: true });
        setIsFollowing(followStatusResponse.data.isFollowing);
      } catch (error) {
        setLoggedInUser(null);
      }
    };

    fetchProfile();
  }, [username]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        // Unfollow user
        await axios.delete(`http://localhost:4000/profile/${username}/unfollow`, { withCredentials: true });
        setIsFollowing(false);
        setProfileData((prevData) => ({
          ...prevData,
          followersCount: prevData.followersCount - 1, // Decrease the other user's followers count
        }));
        setLoggedInUserFollowingCount((prevCount) => prevCount - 1); // Decrease logged-in user's following count
      } else {
        // Follow user
        await axios.post(`http://localhost:4000/profile/${username}/follow`, {}, { withCredentials: true });
        setIsFollowing(true);
        setProfileData((prevData) => ({
          ...prevData,
          followersCount: prevData.followersCount + 1, // Increase the other user's followers count
        }));
        setLoggedInUserFollowingCount((prevCount) => prevCount + 1); // Increase logged-in user's following count
      }

      // After following/unfollowing, fetch the updated logged-in user's following count
      const loggedInUserProfileResponse = await axios.get(`http://localhost:4000/profile/${loggedInUser}`, { withCredentials: true });
      setLoggedInUserFollowingCount(loggedInUserProfileResponse.data.followingCount); // Update the following count for the logged-in user
    } catch (error) {
      console.error('Error following/unfollowing the user', error);
    }
  };

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

              {loggedInUser === profileData.username ? (
                <button
                  className="edit-profile-btn"
                  onClick={() => navigate(`/profile/${username}/edit`)}
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  className="edit-profile-btn"
                  onClick={handleFollow}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>

            <div className="profile-stats">
              <span><strong>{profileData.postCount}</strong> posts</span>
              <span onClick={openFollowersModal} style={{ cursor: 'pointer' }}>
                <strong>{profileData.followersCount}</strong> followers
              </span>
              {loggedInUser === profileData.username ? (
                <span onClick={openFollowingModal} style={{ cursor: 'pointer' }}>
                  <strong>{loggedInUserFollowingCount}</strong> following
                </span>
              ) : (
                <span style={{ cursor: 'pointer' }}>
                  <strong>{profileData.followingCount}</strong> following
                </span>
              )}
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
