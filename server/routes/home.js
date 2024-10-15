const express = require('express');
const homeRouter = express.Router();

// Home route - only accessible if logged in
homeRouter.get('/', (req, res) => {
  if (req.isAuthenticated()) { // Check if the user is authenticated
    return res.status(200).json({ message: `Welcome to MoonBook, ${req.user.username}!`, username: req.user.username });
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

module.exports = homeRouter;
