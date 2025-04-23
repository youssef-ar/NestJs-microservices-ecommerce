import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AdminGuard } from './guards/adminGuard';

@Module({
  providers: [JwtGuard, JwtStrategy, AdminGuard],
  exports: [JwtGuard, JwtStrategy, AdminGuard],
})
export class SharedModule {}
