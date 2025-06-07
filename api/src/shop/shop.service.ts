import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ShopService {
  private prisma = new PrismaClient();

  // Fetch all products
  async findAll() {
    try {
      return await this.prisma.shopProduct.findMany();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  // Fetch a single product by ID
  async findOne(id: string) {
    try {
      const product = await this.prisma.shopProduct.findUnique({ where: { id } });
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return product;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  }

  // Create a new product
  async create(createDto: { productId: string; title: string; description: string; price: number; image: string }) {
    try {
      return await this.prisma.shopProduct.create({
        data: {
          productId: createDto.productId,
          title: createDto.title,
          description: createDto.description,
          price: createDto.price,
          imageUrl: createDto.image,
        },
      });
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  }

  // Update an existing product
  async update(
    id: string,
    updateDto: { title?: string; description?: string; price?: number; image?: string }
  ) {
    try {
      const product = await this.prisma.shopProduct.findUnique({ where: { id } });
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      return await this.prisma.shopProduct.update({
        where: { id },
        data: updateDto,
      });
    } catch (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      throw new Error('Failed to update product');
    }
  }

  // Delete a product by ID
  async remove(id: string) {
    try {
      const product = await this.prisma.shopProduct.findUnique({ where: { id } });
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      return await this.prisma.shopProduct.delete({ where: { id } });
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      throw new Error('Failed to delete product');
    }
  }
}