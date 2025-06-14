"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const winston_logger_1 = require("./common/logger/winston.logger");
const jwt_auth_guard_1 = require("./auth/jwt-auth.guard");
const core_2 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const reflector = app.get(core_2.Reflector);
    const jwtService = app.get(jwt_1.JwtService);
    const configService = app.get(config_1.ConfigService);
    const dbUrl = configService.get('DATABASE_URL');
    console.log(`DATABASE_URL from ConfigService: ${dbUrl}`);
    console.log(`DATABASE_URL from process.env: ${process.env.DATABASE_URL}`);
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
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    app.use(cookieParser());
    app.use(helmet());
    app.use(rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
    }));
    app.setGlobalPrefix('api');
    app.useGlobalGuards(new jwt_auth_guard_1.JwtAuthGuard(reflector, jwtService));
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    app.useLogger(winston_logger_1.logger);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map