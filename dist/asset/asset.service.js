"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let AssetService = class AssetService {
    prisma = new client_1.PrismaClient();
    async createAsset(data) {
        return this.prisma.asset.create({ data });
    }
    async findAll() {
        return this.prisma.asset.findMany();
    }
    async updateAsset(id, updateData) {
        return this.prisma.asset.update({
            where: { id },
            data: updateData,
        });
    }
    async removeAsset(id) {
        return this.prisma.asset.delete({ where: { id } });
    }
};
exports.AssetService = AssetService;
exports.AssetService = AssetService = __decorate([
    (0, common_1.Injectable)()
], AssetService);
//# sourceMappingURL=asset.service.js.map