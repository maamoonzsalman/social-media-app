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

// Update user profile by username
profileRouter.put('/:username/edit', async (req, res) => {
    const { username } = req.params;
    const { bio, profilePic } = req.body;
  
    try {
      const user = await prisma.user.update({
        where: { username },
        data: { bio, profilePic }
      });
  
      res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating profile' });
    }
  });

// Follow a user
profileRouter.post('/:username/follow', async (req, res) => {
    const { username } = req.params;
    const loggedInUser = req.user; // Assuming Passport.js is handling authentication
  
    if (!loggedInUser) {
      return res.status(401).json({ message: 'You need to be logged in to follow someone.' });
    }
  
    try {
      const userToFollow = await prisma.user.findUnique({ where: { username } });
  
      if (!userToFollow) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the logged-in user is already following the target user
      const alreadyFollowing = await prisma.follows.findFirst({
        where: {
          followerId: loggedInUser.id,
          followingId: userToFollow.id
        }
      });
  
      if (alreadyFollowing) {
        return res.status(400).json({ message: 'You are already following this user.' });
      }
  
      // Create the follow relationship
      await prisma.follows.create({
        data: {
          followerId: loggedInUser.id,
          followingId: userToFollow.id
        }
      });
  
      res.status(200).json({ message: 'Followed successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error following the user.' });
    }
  });
  
  // Unfollow a user
  profileRouter.delete('/:username/unfollow', async (req, res) => {
    const { username } = req.params;
    const loggedInUser = req.user;
  
    if (!loggedInUser) {
      return res.status(401).json({ message: 'You need to be logged in to unfollow someone.' });
    }
  
    try {
      const userToUnfollow = await prisma.user.findUnique({ where: { username } });
  
      if (!userToUnfollow) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const followRecord = await prisma.follows.findFirst({
        where: {
          followerId: loggedInUser.id,
          followingId: userToUnfollow.id
        }
      });
  
      if (!followRecord) {
        return res.status(400).json({ message: 'You are not following this user.' });
      }
  
      // Delete the follow relationship
      await prisma.follows.delete({
        where: { id: followRecord.id }
      });
  
      res.status(200).json({ message: 'Unfollowed successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error unfollowing the user.' });
    }
  });
  
  // Check if logged-in user is following a profile
profileRouter.get('/:username/isFollowing', async (req, res) => {
    const { username } = req.params;
    const loggedInUser = req.user;
  
    if (!loggedInUser) {
      return res.status(401).json({ isFollowing: false });
    }
  
    try {
      const userToCheck = await prisma.user.findUnique({ where: { username } });
      if (!userToCheck) {
        return res.status(404).json({ isFollowing: false });
      }
  
      const isFollowing = await prisma.follows.findFirst({
        where: {
          followerId: loggedInUser.id,
          followingId: userToCheck.id,
        }
      });
  
      res.status(200).json({ isFollowing: Boolean(isFollowing) });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error checking follow status' });
    }
  });
  
  
  

module.exports = profileRouter;
