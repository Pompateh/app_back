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
        // Try getting the URI directly from process.env as a fallback/check
        const uriFromProcessEnv = process.env.DATABASE_URL;
        const uriFromConfigService = configService.get<string>('DATABASE_URL');

        console.log(`[MongooseModule Debug] URI from process.env: ${uriFromProcessEnv}`);
        console.log(`[MongooseModule Debug] URI from ConfigService: ${uriFromConfigService}`);

        const uri = uriFromConfigService || uriFromProcessEnv; // Prefer ConfigService, fallback to process.env

        console.log(`[MongooseModule Debug] Final URI being used: ${uri}`);

        if (!uri) {
          console.error('[MongooseModule Debug] Final DATABASE_URL is undefined or empty!');
           // Potentially throw an error here to stop if URI is critical
           // throw new Error('DATABASE_URL environment variable is not set.');
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
    HealthModule,
    AssetModule,
    SettingModule,
    OrderModule,
    NewsletterModule,
    UsersModule,
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