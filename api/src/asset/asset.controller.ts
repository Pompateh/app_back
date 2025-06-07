import { Controller, Post, Get, Put, Delete, Param, Body, UseInterceptors, UploadedFile, BadRequestException, Logger, InternalServerErrorException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AssetService } from './asset.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('assets')
export class AssetController {
  private readonly logger = new Logger(AssetController.name);

  constructor(private readonly assetService: AssetService) {}

  // File upload endpoint – adjust storage destination as needed
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Make sure this folder exists
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, file.fieldname + '-' + uniqueSuffix + ext);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('caption') caption: string) {
    try {
      if (!file) {
        throw new BadRequestException('File is required');
      }
      // Assume the file is served statically from /uploads
      const asset = await this.assetService.createAsset({
        url: `/uploads/${file.filename}`,
        filename: file.filename,
        caption,
      });
      return asset;
    } catch (error) {
      this.logger.error('Error uploading file', error.stack);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  @Get()
  async getAssets() {
    try {
      return this.assetService.findAll();
    } catch (error) {
      this.logger.error('Error fetching assets', error.stack);
      throw new InternalServerErrorException('Failed to fetch assets');
    }
  }

  @Put(':id')
  async updateAsset(@Param('id') id: string, @Body() updateData: { caption?: string }) {
    try {
      return this.assetService.updateAsset(id, updateData);
    } catch (error) {
      this.logger.error(`Error updating asset with id ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to update asset');
    }
  }

  @Delete(':id')
  async deleteAsset(@Param('id') id: string) {
    try {
      return this.assetService.removeAsset(id);
    } catch (error) {
      this.logger.error(`Error deleting asset with id ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to delete asset');
    }
  }
}