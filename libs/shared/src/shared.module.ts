import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  providers: [JwtGuard, JwtStrategy],
  exports: [JwtGuard, JwtStrategy],
})
export class SharedModule {}
