import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function createAdmin() {
  const prisma = new PrismaClient();
  const email = 'newstalgia39';
  const password = 'justdoit';
  const role = 'admin';

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('User already exists, updating password...');
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { 
          password: hashedPassword,
          role: 'admin' // Ensure role is set to admin
        },
      });
      console.log('User updated successfully:', updatedUser.email);
    } else {
      // Create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
        },
      });
      console.log('Admin user created successfully:', newUser.email);
    }

    // Verify the user exists and can be found
    const verifyUser = await prisma.user.findUnique({
      where: { email },
    });
    console.log('Verification - User exists:', !!verifyUser);
    console.log('User details:', {
      email: verifyUser?.email,
      role: verifyUser?.role,
      id: verifyUser?.id
    });

  } catch (error) {
    console.error('Error managing admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 