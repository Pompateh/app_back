import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// Using require for middleware compatibility
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { logger } from './common/logger/winston.logger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);
  const configService = app.get(ConfigService);

  // Log the DATABASE_URL to check if it's being read
  const dbUrl = configService.get<string>('DATABASE_URL');
  console.log(`DATABASE_URL from ConfigService: ${dbUrl}`);
  console.log(`DATABASE_URL from process.env: ${process.env.DATABASE_URL}`);

  // Enable CORS - Explicitly allow Netlify domains and custom domain
  app.enableCors({
    origin: [
      process.env.CORS_ORIGIN || 'http://localhost:3000',
      'https://wearenewstalgiaa.netlify.app',
      'https://app-back-gc64.onrender.com',
      'https://wearenewstalgia.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Range', 'Cookie'],
    exposedHeaders: ['Content-Range', 'X-Content-Range', 'Set-Cookie'],
  });

  // Global pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Middleware
  app.use(cookieParser());
  app.use(helmet());

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  // Set global prefix
  app.setGlobalPrefix('api');

  // Global JWT auth guard
  app.useGlobalGuards(new JwtAuthGuard(reflector, jwtService));

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Winston logger
  app.useLogger(logger);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
