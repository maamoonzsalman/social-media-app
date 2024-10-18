const express = require('express');
const homeRouter = express.Router();
const prisma = require('../prisma/prismaClient'); // Import your Prisma client

// Home route - only accessible if logged in
homeRouter.get('/', async (req, res) => {
  if (req.isAuthenticated()) { // Check if the user is authenticated
    try {
      // Get a list of 5 random users the logged-in user is NOT following
      const suggestedUsers = await prisma.user.findMany({
        where: {
          NOT: {
            followers: {
              some: { followerId: req.user.id } // Exclude users the logged-in user is following
            }
          },
          id: { not: req.user.id } // Exclude the logged-in user themselves
        },
        orderBy: {
          // Randomize results
          createdAt: 'asc',
        },
        take: 8 // Limit to 5 random users
      });

      return res.status(200).json({ username: req.user.username, suggestedUsers });
    } catch (error) {
      console.error('Error fetching suggested users:', error);
      return res.status(500).json({ message: 'Error fetching suggested users' });
    }
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

module.exports = homeRouter;

