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

    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.use(helmet());
    app.useGlobalGuards(new JwtAuthGuard(reflector, jwtService));
    app.use(cookieParser());
    // Configure CORS
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001'];
    app.enableCors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true); // Allow the request
        } else {
          callback(new Error(`Origin ${origin} not allowed by CORS`)); // Block the request
        }
      },
      credentials: true, // Allow cookies and credentials
    });

    // Global Validation: whitelist and forbid non-whitelisted properties
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Rate limiting to prevent abuse
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
      }),
    );

    // Global Exception Filter for consistent error responses
    app.useGlobalFilters(new AllExceptionsFilter());

    // Set up logger (using Winston)
    app.useLogger(logger);

    const port = process.env.PORT || 3001;
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`);
  } catch (error) {
    console.error('Error starting the application:', error);
  }
}
bootstrap();