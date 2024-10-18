import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar'; // Assuming you're using Sidebar
import '../styles/Create.css'

const Create = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // React Router hook for redirection

  const [username, setUsername] = useState('');

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

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image);
    formData.append('caption', caption);

    try {
      const response = await axios.post('http://localhost:4000/upload', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMessage(response.data);
      console.log(response.data)

      // Assuming the response contains the username or you can fetch it
      //const { username } = response.data;

      // Redirect to profile page after successful post
      navigate(`/profile/${username}`);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error uploading post');
    }
  };

  return (
    <div className="create-page">
      <Sidebar username={username}/> {/* Sidebar on the left */}
      <div className="create-container">
        <h2>Create a Post</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="image">Choose Image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>
          <div>
            <label htmlFor="caption">Caption</label>
            <textarea
              id="caption"
              name="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption (optional)"
            />
          </div>
          <button type="submit">Post</button>
        </form>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </div>
    </div>
  );
};

export default Create;
