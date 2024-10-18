const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const registerRouter = express.Router();

// Handle user registration
registerRouter.post('/', async (req, res) => {
  const { username, password, email, firstName, lastName } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email }
  });

  if (existingUser) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database
    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
        email: email,
        firstName: firstName,  // Add firstName and lastName fields
        lastName: lastName
      }
    });


    // Automatically log in the user after registration
    req.login(newUser, (err) => {
      if (err) {
        console.log('this is error', err)
        return res.status(500).json({ message: 'Error logging in after registration' });
      }
      return res.status(201).json({ message: 'User registered and logged in', redirectTo: '/home' });
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Route to delete user account by username
registerRouter.delete('/:username/delete', async (req, res) => {
    const { username } = req.params;
    const loggedInUser = req.user; // Assuming Passport.js handles authentication
  
    // Ensure that the logged-in user is the one trying to delete the account
    if (loggedInUser.username !== username) {
      return res.status(403).json({ message: 'You can only delete your own account' });
    }
  
    try {
      // Delete the user account
      await prisma.user.delete({
        where: { username }
      });
  
      // Log out the user after account deletion
      req.logout((err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error logging out after account deletion' });
        }
        return res.status(200).json({ message: 'Account deleted successfully', redirectTo: '/register' });
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting account' });
    }
  });

registerRouter.get('/', (req, res) => {
    res.send('Server is running');
  });
module.exports = registerRouter;
