import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('products')
  async findAll() {
    return this.shopService.findAll();
  }

  @Get('products/:id')
  async findOne(@Param('id') id: string) {
    return this.shopService.findOne(id);
  }

  // Protected endpoints for creating, updating, deleting products:
  @UseGuards(JwtAuthGuard)
  @Post('products')
  async create(
    @Body() createDto: { productId: string; title: string; description: string; price: number; image: string }
  ) {
    return this.shopService.create(createDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('products/:id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: { title?: string; description?: string; price?: number; image?: string }
  ) {
    return this.shopService.update(id, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('products/:id')
  async remove(@Param('id') id: string) {
    return this.shopService.remove(id);
  }
}
