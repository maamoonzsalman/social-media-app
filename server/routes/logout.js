const express = require('express');
const logoutRouter = express.Router();

// Logout route
logoutRouter.post('/', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    req.session.destroy(); // Destroy the session
    res.clearCookie('connect.sid'); // Clear the session cookie
    return res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = logoutRouter;
