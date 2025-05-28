import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('favicon.ico')
  getFavicon() {
    return ''; // Or serve a real favicon if you have one
  }

  @Get('api/health')
  healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}