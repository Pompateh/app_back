import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateUsers() {
  try {
    // Get all users
    const users = await prisma.user.findMany();
    
    // Update each user
    for (const user of users) {
      // Generate username from email (remove @ and everything after it)
      const username = user.email.split('@')[0];
      
      // Update the user with the new username
      await prisma.user.update({
        where: { id: user.id },
        data: { username },
      });
      
      console.log(`Updated user ${user.email} with username ${username}`);
    }
    
    console.log('All users updated successfully');
  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUsers(); 