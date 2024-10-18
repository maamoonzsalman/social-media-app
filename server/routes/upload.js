const express = require('express');
const multer = require('multer');
const path = require('path');
const prisma = require('../prisma/prismaClient');

const uploadRouter = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Define where to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Create a unique file name
  },
});

const upload = multer({ storage });

// Route to handle post creation with image upload
uploadRouter.post('/', upload.single('image'), async (req, res) => {
  const { caption } = req.body;
  const imagePath = `/uploads/${req.file.filename}`; // Construct image URL based on the stored path

  try {
    // Get the logged-in user (using session)
    const userId = req.user.id; // Assuming Passport.js is managing the session

    // Create a new post in the database
    const newPost = await prisma.post.create({
      data: {
        image: imagePath, // Save the image path in the database
        caption: caption || '', // Save the caption if provided
        user: {
          connect: { id: userId }, // Associate the post with the logged-in user
        },
      },
    });

    res.status(201).json({ message: 'Post uploaded successfully', post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading post' });
  }
});

module.exports = uploadRouter;
