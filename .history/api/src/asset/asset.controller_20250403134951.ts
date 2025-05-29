import { Controller, Post, Get, Put, Delete, Param, Body, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AssetService } from './asset.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('assets')
export class AssetController {
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
  }

  @Get()
  async getAssets() {
    return this.assetService.findAll();
  }

  @Put(':id')
  async updateAsset(@Param('id') id: string, @Body() updateData: { caption?: string }) {
    return this.assetService.updateAsset(id, updateData);
  }

  @Delete(':id')
  async deleteAsset(@Param('id') id: string) {
    return this.assetService.removeAsset(id);
  }
}
