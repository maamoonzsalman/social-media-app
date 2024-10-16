const express = require('express');
const profileRouter = express.Router();
const prisma = require('../prisma/prismaClient')

// Get user profile information and posts by username
profileRouter.get('/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        posts: true, // Fetch the user's posts
        _count: { select: { followers: true, following: true } } // Get follower/following count
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      username: user.username,
      profilePicture: user.profilePicture, // You'd need to add this field in the User model if needed
      postCount: user.posts.length,
      followersCount: user._count.followers,
      followingCount: user._count.following,
      posts: user.posts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

module.exports = profileRouter;
