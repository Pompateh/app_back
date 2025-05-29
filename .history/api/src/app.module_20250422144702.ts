import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { StudioModule } from './studio/studio.module';
import { ProjectModule } from './project/project.module';
import { ShopModule } from './shop/shop.module';
import { OrderModule } from './order/order.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { AssetModule } from './asset/asset.module';
import { SettingModule } from './setting/setting.module';
import { NotificationModule } from './notification/notification.module';
import { CartModule } from './cart/cart.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load environment variables globally
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'), // Load MONGODB_URI from .env
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    StudioModule,
    ProjectModule,
    ShopModule,
    OrderModule,
    NewsletterModule,
    UsersModule,
    HealthModule,
    AssetModule,
    PostModule,
    SettingModule,
    NotificationModule,
    CartModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}