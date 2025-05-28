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
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('DATABASE_URL');
        console.log(`[MongooseModule] Attempting to connect with URI: ${uri}`);
        if (!uri) {
          console.error('[MongooseModule] DATABASE_URL is undefined!');
        }
        return {
          uri: uri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    PostModule,
    ProjectModule,
    StudioModule,
    ShopModule,
    CartModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}