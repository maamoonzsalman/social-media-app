// deletePosts.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deletePostsForUser(username) {
  try {
    // First, find the user by username
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      console.log(`User with username "${username}" not found.`);
      return;
    }

    // Delete all posts associated with the user's ID
    const deletedPosts = await prisma.post.deleteMany({
      where: {
        userId: user.id,
      },
    });

    console.log(`Deleted ${deletedPosts.count} post(s) for user "${username}".`);
  } catch (error) {
    console.error('Error deleting posts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deletePostsForUser('One');
