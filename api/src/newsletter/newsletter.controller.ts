import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NewsletterService } from './newsletter.service';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  // Public endpoint for users to subscribe:
  @Post('subscribe')
  async subscribe(@Body() body: { email: string }) {
    return this.newsletterService.subscribe(body.email);
  }

  // Protected endpoints for admin management:
  @UseGuards(JwtAuthGuard)
  @Get('subscribers')
  async listSubscribers() {
    return this.newsletterService.listSubscribers();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('unsubscribe/:id')
  async unsubscribe(@Param('id') id: string) {
    return this.newsletterService.unsubscribe(id);
  }
}
