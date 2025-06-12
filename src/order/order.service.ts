import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class OrderService {
  private prisma = new PrismaClient();

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        project: true,
        user: true
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.order.findUnique({ 
      where: { id },
      include: {
        project: true,
        user: true
      }
    });
  }

  async create(createDto: { 
    orderRef: string; 
    userId: string; 
    projectId: string;
    total: number; 
    status: string 
  }) {
    return this.prisma.order.create({
      data: {
        orderRef: createDto.orderRef,
        user: {
          connect: { id: createDto.userId }
        },
        project: {
          connect: { id: createDto.projectId }
        },
        total: createDto.total,
        status: createDto.status,
      },
      include: {
        project: true,
        user: true
      }
    });
  }

  async remove(id: string) {
    return this.prisma.order.delete({ 
      where: { id },
      include: {
        project: true,
        user: true
      }
    });
  }

  // Checkout: Create an order from a user's cart items
  async checkout(userId: string, projectId: string) {
    // Get the user's cart items (assuming you have a CartService or query directly)
    const cartItems = await this.prisma.cartItem.findMany({ where: { userId } });
    if (cartItems.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    // Calculate total price; assume you join with ShopProduct to get price
    let total = 0;
    for (const item of cartItems) {
      const product = await this.prisma.shopProduct.findUnique({ where: { id: item.productId } });
      if (product) {
        total += product.price * item.quantity;
      }
    }

    // Generate an order reference (e.g., using timestamp or random string)
    const orderRef = 'ORD-' + Date.now();

    // Create the order
    const order = await this.prisma.order.create({
      data: {
        orderRef,
        user: {
          connect: { id: userId }
        },
        project: {
          connect: { id: projectId }
        },
        total,
        status: 'pending', // or 'completed' if payment is processed immediately
      },
      include: {
        project: true,
        user: true
      }
    });

    // Clear the user's cart after creating the order
    await this.prisma.cartItem.deleteMany({ where: { userId } });

    return order;
  }
}
