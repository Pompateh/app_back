import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  [key: string]: any;
}

async function migrateFiles() {
  // Initialize NestJS application to get ConfigService
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);

  // Configure Cloudinary
  cloudinary.config({
    cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
    api_key: configService.get('CLOUDINARY_API_KEY'),
    api_secret: configService.get('CLOUDINARY_API_SECRET'),
  });

  const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    console.error('Uploads directory not found!');
    return;
  }

  const files = fs.readdirSync(uploadsDir);
  console.log(`Found ${files.length} files to migrate`);

  const results = {
    success: [] as string[],
    failed: [] as string[],
  };

  for (const file of files) {
    if (file === '.gitkeep') continue;

    const filePath = path.join(uploadsDir, file);
    try {
      const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        cloudinary.uploader.upload(
          filePath,
          {
            resource_type: 'auto',
            public_id: path.parse(file).name,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          }
        );
      });

      console.log(`Successfully migrated: ${file}`);
      console.log(`Cloudinary URL: ${result.url}`);
      results.success.push(file);
    } catch (error) {
      console.error(`Failed to migrate ${file}:`, error);
      results.failed.push(file);
    }
  }

  console.log('\nMigration Summary:');
  console.log(`Successfully migrated: ${results.success.length} files`);
  console.log(`Failed to migrate: ${results.failed.length} files`);
  
  if (results.failed.length > 0) {
    console.log('\nFailed files:');
    results.failed.forEach(file => console.log(`- ${file}`));
  }

  // Close the application context
  await app.close();
}

// Run the migration
migrateFiles().catch(console.error); 