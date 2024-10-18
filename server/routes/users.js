const express = require('express');
const prisma = require('../prisma/prismaClient'); // Adjust the path to your Prisma client
const userRouter = express.Router();

// Search users by username (case insensitive, starts with match)
userRouter.get('/search', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Query is required' });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          startsWith: query,  // Match only if username starts with the query
          mode: 'insensitive', // Case-insensitive search
        },
      },
      select: {
        id: true,
        username: true,
        profilePic: true, // Adjust this to whatever fields you want to return
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    return res.status(500).json({ message: 'Error searching users' });
  }
});

module.exports = userRouter;
