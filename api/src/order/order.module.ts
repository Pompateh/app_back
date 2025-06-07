import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule

@Module({
  imports: [AuthModule], // Add AuthModule to imports
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}