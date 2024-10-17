import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/FollowersModal.css'

const FollowersModal = ({ username, onClose }) => {
  const [followers, setFollowers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/profile/${username}/followers`, { withCredentials: true });
        setFollowers(response.data);
      } catch (error) {
        setErrorMessage('Error fetching followers');
      }
    };

    fetchFollowers();
  }, [username, navigate]);

  const removeFollower = async (followerUsername) => {
    try {
      await axios.delete(`http://localhost:4000/profile/${username}/followers/${followerUsername}`, { withCredentials: true });
      setFollowers(followers.filter(follower => follower.username !== followerUsername));
    } catch (error) {
      setErrorMessage('Error removing follower');
    }
  };

  const handleClose = () => {
    onClose();
    navigate(`/profile/${username}`, { replace: true });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Followers</h3>
            <button onClick={handleClose}>&times;</button>
          </div>
          <div className="modal-body">
            <input type="text" placeholder="Search followers" />
            {errorMessage && <p>{errorMessage}</p>}
            <ul className="followers-list">
              {followers.length > 0 ? (
                followers.map(follower => (
                  <li key={follower.id} className="follower-item">
                    <Link to={`/profile/${follower.username}`} className="follower-info">
                      <img src={follower.profilePic || '/default-profile.jpg'} alt={`${follower.username}'s profile`} />
                      <span>{follower.username}</span>
                    </Link>
                    <button onClick={() => removeFollower(follower.username)} className="remove-btn">Remove</button>
                  </li>
                ))
              ) : (
                <p>No followers found</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowersModal;
