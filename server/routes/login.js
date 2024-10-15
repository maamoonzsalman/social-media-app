const express = require('express');
const passport = require('passport');
const loginRouter = express.Router();

loginRouter.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err); // Handle error
    }
    if (!user) {
      return res.status(401).json({ message: info.message || 'Invalid credentials' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging in' });
      }
      // Respond with a success message and the redirect URL
      return res.status(200).json({ message: 'Login successful', redirectTo: '/home', user: user });
    });
  })(req, res, next);
});

module.exports = loginRouter;
