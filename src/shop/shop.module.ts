import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: 'taodep123', // Replace with your actual secret key
      signOptions: { expiresIn: '1h' }, // Optional: Configure token expiration
    }),
  ],
  providers: [ShopService, JwtAuthGuard],
  controllers: [ShopController],
})
export class ShopModule {}