const fs = require('fs');
const path = require('path');

const envContent = `DATABASE_URL=mongodb+srv://0906531101h:taodep123@cluster0.8kcvfhr.mongodb.net/clothing_shop?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=clothing_shop_secret_key_2024
NEXT_PUBLIC_API_URL=https://app-back-gc64.onrender.com`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('.env file created successfully');
} catch (error) {
  console.error('Error creating .env file:', error);
} 