import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Add an item to the cart
  @Post()
  async addItem(@Body() body: { userId: string; productId: string; quantity?: number }) {
    const { userId, productId, quantity } = body;
    return this.cartService.addItem(userId, productId, quantity || 1);
  }

  // Get the current cart for a user
  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  // Update a cart item (e.g., change quantity)
  @Put(':itemId')
  async updateItem(@Param('itemId') itemId: string, @Body() body: { quantity: number }) {
    return this.cartService.updateItem(itemId, body.quantity);
  }

  // Remove a cart item
  @Delete(':itemId')
  async removeItem(@Param('itemId') itemId: string) {
    return this.cartService.removeItem(itemId);
  }

  // Clear the entire cart for a user
  @Delete('clear/:userId')
  async clearCart(@Param('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
