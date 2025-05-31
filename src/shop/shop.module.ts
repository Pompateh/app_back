import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'taodep123',
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  providers: [ShopService, JwtAuthGuard],
  controllers: [ShopController],
})
export class ShopModule {}