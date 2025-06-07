import { Module } from '@nestjs/common';
import { StudioController } from './studio.controller';
import { StudioService } from './studio.service';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule

@Module({
  imports: [AuthModule], // Import AuthModule to provide JwtService
  controllers: [StudioController],
  providers: [StudioService],
})
export class StudioModule {}