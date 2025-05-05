import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { SettingService } from './setting.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.settingService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':key')
  async getSetting(@Param('key') key: string) {
    return this.settingService.getSetting(key);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':key')
  async updateSetting(@Param('key') key: string, @Body() body: { value: string }) {
    return this.settingService.updateSetting(key, body.value);
  }
}
