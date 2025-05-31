import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  [key: string]: any;
}

@Controller('upload')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(private readonly configService: ConfigService) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File upload failed');
    }
    
    try {
      // Upload to Cloudinary
      const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          }
        ).end(file.buffer);
      });

      this.logger.log(`File uploaded successfully to Cloudinary: ${result.url}`);
      return { url: result.url };
    } catch (error) {
      this.logger.error(`File upload error: ${error.message}`);
      throw new BadRequestException('File upload failed');
    }
  }
}