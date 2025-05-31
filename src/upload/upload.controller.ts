import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

@Controller('upload')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);
  private readonly uploadDir = join(__dirname, '..', '..', 'uploads');

  constructor() {
    // Ensure uploads directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      this.logger.log(`Created uploads directory at: ${this.uploadDir}`);
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, callback) => {
        if (!file) {
          callback(new Error('No file provided'), '');
          return;
        }
        callback(null, this.uploadDir);
      },
      filename: (req, file, callback) => {
        if (!file) {
          callback(new Error('No file provided'), '');
          return;
        }
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      // Add file type validation if needed
      callback(null, true);
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File upload failed');
    }
    
    try {
      const url = `/uploads/${file.filename}`;
      this.logger.log(`File uploaded successfully: ${url}`);
      return { url };
    } catch (error) {
      this.logger.error(`File upload error: ${error.message}`);
      throw new BadRequestException('File upload failed');
    }
  }
}