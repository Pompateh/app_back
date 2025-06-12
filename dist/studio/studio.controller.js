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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudioController = void 0;
const common_1 = require("@nestjs/common");
const studio_service_1 = require("./studio.service");
const create_studio_dto_1 = require("./dto/create-studio.dto");
const update_studio_dto_1 = require("./dto/update-studio.dto");
const public_decorator_1 = require("../auth/public.decorator");
let StudioController = class StudioController {
    studioService;
    constructor(studioService) {
        this.studioService = studioService;
    }
    async findAll() {
        return this.studioService.findAll();
    }
    async findOne(id) {
        return this.studioService.findOne(id);
    }
    async create(createStudioDto) {
        return this.studioService.create(createStudioDto);
    }
    async update(id, updateStudioDto) {
        return this.studioService.update(id, updateStudioDto);
    }
    async delete(id) {
        return this.studioService.delete(id);
    }
};
exports.StudioController = StudioController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StudioController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudioController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_studio_dto_1.CreateStudioDto]),
    __metadata("design:returntype", Promise)
], StudioController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_studio_dto_1.UpdateStudioDto]),
    __metadata("design:returntype", Promise)
], StudioController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudioController.prototype, "delete", null);
exports.StudioController = StudioController = __decorate([
    (0, common_1.Controller)('studios'),
    __metadata("design:paramtypes", [studio_service_1.StudioService])
], StudioController);
//# sourceMappingURL=studio.controller.js.map