import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar'; // Import Sidebar component
import '../styles/Search.css'; // Make sure to create a CSS file for custom styles

const Search = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loggedInUsername, setLoggedInUsername] = useState(null);

  useEffect(() => {
    // Fetch the logged-in user's username for Sidebar
    const fetchLoggedInUser = async () => {
      try {
        const response = await axios.get('http://localhost:4000/home', { withCredentials: true });
        setLoggedInUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching logged-in user:', error);
      }
    };

    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    if (query.trim() !== '') {
      const fetchUsers = async () => {
        try {
          const response = await axios.get('http://localhost:4000/users/search', {
            params: { query },
            withCredentials: true,
          });
          setUsers(response.data);
        } catch (error) {
          console.error('Error searching users:', error);
        }
      };

      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [query]);

  return (
    <div className="search-page">
      <Sidebar username={loggedInUsername} /> {/* Sidebar on the left */}
      <div className="search-container">
        <h2>Search Users</h2>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by username"
          className="search-bar"
        />
        <div className="user-list">
          {users.length > 0 ? (
            users.map(user => (
              <div key={user.id} className="user-item">
                <img
                  src={user.profilePic || '/default-profile.jpg'}
                  alt={`${user.username}'s profile`}
                  className="user-profile-pic"
                />
                <Link to={`/profile/${user.username}`} className="user-link">
                  {user.username}
                </Link>
              </div>
            ))
          ) : (
            query && <p>No users found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
