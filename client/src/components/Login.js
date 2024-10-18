import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Make sure to import the CSS file

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // React Router hook for redirection

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:4000/login', { username, password }, { withCredentials: true });
      setSuccessMessage(response.data.message);
      setErrorMessage('');
      // Redirect the user to /home on successful login
      navigate(response.data.redirectTo);
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage(error.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = () => {
    navigate('/register'); // Redirect to the /register route
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        
        {/* Add Register Button */}
        <button onClick={handleRegister} className="register-btn">
          New? Click here to create an account
        </button>
      </div>
    </div>
  );
};

export default Login;
