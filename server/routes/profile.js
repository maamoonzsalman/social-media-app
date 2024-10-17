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
      profilePicture: user.profilePic, // You'd need to add this field in the User model if needed
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

// Get followers of a user
profileRouter.get('/:username/followers', async (req, res) => {
    const { username } = req.params;
  
    try {
      const user = await prisma.user.findUnique({
        where: { username },
        include: {
          followers: {
            include: {
              follower: true // Get the details of the follower
            }
          }
        }
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const followers = user.followers.map(follow => ({
        id: follow.follower.id,
        username: follow.follower.username,
        profilePic: follow.follower.profilePic,
      }));
  
      res.status(200).json(followers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching followers' });
    }
  });
  
  // Remove a follower
  profileRouter.delete('/:username/followers/:followerUsername', async (req, res) => {
    const { username, followerUsername } = req.params;
    const loggedInUser = req.user; // Assuming you have Passport.js authentication
  
    if (loggedInUser.username !== username) {
      return res.status(403).json({ message: 'You can only remove your own followers' });
    }
  
    try {
      const follower = await prisma.user.findUnique({
        where: { username: followerUsername }
      });
  
      if (!follower) {
        return res.status(404).json({ message: 'Follower not found' });
      }
  
      await prisma.follows.deleteMany({
        where: {
          followerId: follower.id,
          followingId: loggedInUser.id
        }
      });
  
      res.status(200).json({ message: 'Follower removed' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error removing follower' });
    }
  });

  // Get the users the logged-in user is following
profileRouter.get('/:username/following', async (req, res) => {
    const { username } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { username },
            include: {
                following: {
                    include: {
                        following: true // Get the details of the users the user is following
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const following = user.following.map(follow => ({
            id: follow.following.id,
            username: follow.following.username,
            profilePic: follow.following.profilePic,
        }));

        res.status(200).json(following);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching following data' });
    }
});

  

module.exports = profileRouter;
