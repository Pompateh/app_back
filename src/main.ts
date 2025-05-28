import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { logger } from './common/logger/winston.logger';
import rateLimit from 'express-rate-limit';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const reflector = app.get(Reflector);
    const jwtService = app.get(JwtService);

    // Serve static assets
    app.useStaticAssets(join(__dirname, '..', 'public'));

    // Security middleware
    app.use(helmet());

    // Cookie parser middleware
    app.use(cookieParser());

    // Trust the first proxy
    app.set('trust proxy', 1);

    // ─── CORS CONFIGURATION ────────────────────────────────────────
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:3000',  // Your front-end dev server
      'http://localhost:3001',  // (Optional) if you ever access API directly
      'https://02aa-2402-800-62a8-9538-31c1-4055-60db-4fa6.ngrok-free.app', // Your ngrok URL
    ];
    app.enableCors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true); // Allow the request
        } else {
          callback(new Error(`Origin ${origin} not allowed by CORS`)); // Block it
        }
      },
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true, // Allow cookies/credentials
    });
    // ────────────────────────────────────────────────────────────────

    // Global JWT auth guard
    app.useGlobalGuards(new JwtAuthGuard(reflector, jwtService));

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Rate limiting
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,                 // limit each IP
      }),
    );

    // Global exception filter
    app.useGlobalFilters(new AllExceptionsFilter());

    // Winston logger
    app.useLogger(logger);

    const port = process.env.PORT || 3001;
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`);
  } catch (error) {
    console.error('Error starting the application:', error);
  }
}

bootstrap();
