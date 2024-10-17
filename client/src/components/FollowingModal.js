import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/FollowersModal.css'

const FollowingModal = ({ username, onClose }) => {
  const [following, setFollowing] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch the users the logged-in user is following
    const fetchFollowing = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/profile/${username}/following`, { withCredentials: true });
        setFollowing(response.data);
      } catch (error) {
        setErrorMessage('Error fetching following');
      }
    };

    fetchFollowing();
  }, [username]);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Following</h3>
            <button onClick={onClose}>&times;</button>
          </div>
          <div className="modal-body">
            <input type="text" placeholder="Search following" />
            {errorMessage && <p>{errorMessage}</p>}
            <ul className="following-list">
              {following.length > 0 ? (
                following.map(user => (
                  <li key={user.id} className="following-item">
                    <Link to={`/profile/${user.username}`} className="following-info">
                      <img src={user.profilePic || '/default-profile.jpg'} alt={`${user.username}'s profile`} />
                      <span>{user.username}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <p>No following found</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowingModal;
