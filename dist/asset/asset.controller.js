"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AssetController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const asset_service_1 = require("./asset.service");
const multer_1 = require("multer");
const path_1 = require("path");
let AssetController = AssetController_1 = class AssetController {
    assetService;
    logger = new common_1.Logger(AssetController_1.name);
    constructor(assetService) {
        this.assetService = assetService;
    }
    async uploadFile(file, caption) {
        try {
            if (!file) {
                throw new common_1.BadRequestException('File is required');
            }
            const asset = await this.assetService.createAsset({
                url: `/uploads/${file.filename}`,
                filename: file.filename,
                caption,
            });
            return asset;
        }
        catch (error) {
            this.logger.error('Error uploading file', error.stack);
            throw new common_1.InternalServerErrorException('Failed to upload file');
        }
    }
    async getAssets() {
        try {
            return this.assetService.findAll();
        }
        catch (error) {
            this.logger.error('Error fetching assets', error.stack);
            throw new common_1.InternalServerErrorException('Failed to fetch assets');
        }
    }
    async updateAsset(id, updateData) {
        try {
            return this.assetService.updateAsset(id, updateData);
        }
        catch (error) {
            this.logger.error(`Error updating asset with id ${id}`, error.stack);
            throw new common_1.InternalServerErrorException('Failed to update asset');
        }
    }
    async deleteAsset(id) {
        try {
            return this.assetService.removeAsset(id);
        }
        catch (error) {
            this.logger.error(`Error deleting asset with id ${id}`, error.stack);
            throw new common_1.InternalServerErrorException('Failed to delete asset');
        }
    }
};
exports.AssetController = AssetController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                callback(null, file.fieldname + '-' + uniqueSuffix + ext);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('caption')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AssetController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssetController.prototype, "getAssets", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AssetController.prototype, "updateAsset", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetController.prototype, "deleteAsset", null);
exports.AssetController = AssetController = AssetController_1 = __decorate([
    (0, common_1.Controller)('assets'),
    __metadata("design:paramtypes", [asset_service_1.AssetService])
], AssetController);
//# sourceMappingURL=asset.controller.js.map