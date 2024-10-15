const express = require('express');
const passport = require('passport');
const loginRouter = express.Router();

// Login route
loginRouter.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err); // Error during authentication
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' }); // Authentication failed
    }
    
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging in' }); // Error logging in
      }
      return res.status(200).json({ message: 'Login successful', user: user }); // Successfully logged in
    });
  })(req, res, next);
});

loginRouter.get('/', (req, res) => {
    res.send('Server is running');
  });

module.exports = loginRouter;
