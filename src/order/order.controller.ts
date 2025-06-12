import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Post()
  async create(@Body() createDto: { 
    orderRef: string; 
    userId: string; 
    projectId: string;
    total: number; 
    status: string 
  }) {
    return this.orderService.create(createDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }

  // Checkout endpoint: create an order from the user's cart items
  @Post('checkout/:userId/:projectId')
  async checkout(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string
  ) {
    return this.orderService.checkout(userId, projectId);
  }
}
