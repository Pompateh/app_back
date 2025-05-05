"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let SettingService = class SettingService {
    prisma = new client_1.PrismaClient();
    async getAll() {
        return this.prisma.setting.findMany();
    }
    async getSetting(key) {
        return this.prisma.setting.findUnique({ where: { key } });
    }
    async updateSetting(key, value) {
        return this.prisma.setting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });
    }
};
exports.SettingService = SettingService;
exports.SettingService = SettingService = __decorate([
    (0, common_1.Injectable)()
], SettingService);
//# sourceMappingURL=setting.service.js.map