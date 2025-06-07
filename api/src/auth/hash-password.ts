import * as bcrypt from 'bcrypt';

async function hashPassword() {
  const plainTextPassword = 'password123'; // Replace with your plain text password
  const hashedPassword = await bcrypt.hash(plainTextPassword, 10); // 10 is the salt rounds
  console.log('Hashed Password:', hashedPassword);
}

hashPassword();