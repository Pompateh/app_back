"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const helmet_1 = require("helmet");
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const winston_logger_1 = require("./common/logger/winston.logger");
const express_rate_limit_1 = require("express-rate-limit");
const path_1 = require("path");
const jwt_auth_guard_1 = require("./auth/jwt-auth.guard");
const core_2 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        const reflector = app.get(core_2.Reflector);
        const jwtService = app.get(jwt_1.JwtService);
        app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
        app.use((0, helmet_1.default)());
        app.use(cookieParser());
        app.set('trust proxy', 1);
        const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [
            'http://localhost:3000',
            'http://localhost:3001',
            'https://02aa-2402-800-62a8-9538-31c1-4055-60db-4fa6.ngrok-free.app',
        ];
        app.enableCors({
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                }
                else {
                    callback(new Error(`Origin ${origin} not allowed by CORS`));
                }
            },
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
        });
        app.useGlobalGuards(new jwt_auth_guard_1.JwtAuthGuard(reflector, jwtService));
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        app.use((0, express_rate_limit_1.default)({
            windowMs: 15 * 60 * 1000,
            max: 100,
        }));
        app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
        app.useLogger(winston_logger_1.logger);
        const port = process.env.PORT || 3001;
        await app.listen(port);
        winston_logger_1.logger.log(`Application is running on: http://localhost:${port}`);
    }
    catch (error) {
        console.error('Error starting the application:', error);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map