import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CartService {
  private prisma = new PrismaClient();

  async addItem(userId: string, productId: string, quantity: number = 1) {
    // Check if item already exists in the cart
    const existing = await this.prisma.cartItem.findFirst({
      where: { userId, productId },
    });

    if (existing) {
      // Update the quantity if it already exists
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      // Create a new cart item
      return this.prisma.cartItem.create({
        data: { userId, productId, quantity },
      });
    }
  }

  async updateItem(itemId: string, quantity: number) {
    // Ensure quantity is at least 1; or if 0, remove the item.
    if (quantity <= 0) {
      return this.removeItem(itemId);
    }
    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  async removeItem(itemId: string) {
    // Verify that the item exists
    const item = await this.prisma.cartItem.findUnique({ where: { id: itemId } });
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }
    return this.prisma.cartItem.delete({ where: { id: itemId } });
  }

  async getCart(userId: string) {
    return this.prisma.cartItem.findMany({ where: { userId } });
  }

  async clearCart(userId: string) {
    // Delete all cart items for the user
    return this.prisma.cartItem.deleteMany({ where: { userId } });
  }
}
