"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("./auth/auth.module");
const studio_module_1 = require("./studio/studio.module");
const project_module_1 = require("./project/project.module");
const shop_module_1 = require("./shop/shop.module");
const order_module_1 = require("./order/order.module");
const newsletter_module_1 = require("./newsletter/newsletter.module");
const users_module_1 = require("./users/users.module");
const health_module_1 = require("./health/health.module");
const asset_module_1 = require("./asset/asset.module");
const setting_module_1 = require("./setting/setting.module");
const notification_module_1 = require("./notification/notification.module");
const cart_module_1 = require("./cart/cart.module");
const core_1 = require("@nestjs/core");
const jwt_auth_guard_1 = require("./auth/jwt-auth.guard");
const post_module_1 = require("./post/post.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const upload_controller_1 = require("./upload/upload.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const uriFromProcessEnv = process.env.DATABASE_URL;
                    const uriFromConfigService = configService.get('DATABASE_URL');
                    console.log(`[MongooseModule Debug] URI from process.env: ${uriFromProcessEnv}`);
                    console.log(`[MongooseModule Debug] URI from ConfigService: ${uriFromConfigService}`);
                    const uri = uriFromConfigService || uriFromProcessEnv;
                    console.log(`[MongooseModule Debug] Final URI being used: ${uri}`);
                    if (!uri) {
                        console.error('[MongooseModule Debug] Final DATABASE_URL is undefined or empty!');
                    }
                    return {
                        uri: uri,
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                    };
                },
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            post_module_1.PostModule,
            project_module_1.ProjectModule,
            studio_module_1.StudioModule,
            shop_module_1.ShopModule,
            cart_module_1.CartModule,
            notification_module_1.NotificationModule,
            health_module_1.HealthModule,
            asset_module_1.AssetModule,
            setting_module_1.SettingModule,
            order_module_1.OrderModule,
            newsletter_module_1.NewsletterModule,
            users_module_1.UsersModule,
        ],
        controllers: [app_controller_1.AppController, upload_controller_1.UploadController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map