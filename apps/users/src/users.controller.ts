import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthDto } from './dto';
import { JwtGuard } from './guard';
import { GetUser } from './decorator/get-user.decorator';
import { UpdateDto } from './dto/update.dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signUp(@Body() dto: AuthDto) {
    return this.usersService.signUp(dto);
  }
  @Post('signin')
  async signIn(@Body() dto: AuthDto) {
    return this.usersService.signIn(dto);
  }

  @Get()
  @UseGuards(JwtGuard)
  async getCurrentUser(@GetUser('id') id: number) {
    const user = await this.usersService.getCurrentUser(id);
    return user;
  }

  @Patch()
  @UseGuards(JwtGuard)
  async updateUser(@GetUser('id') id: number, @Body() dto: UpdateDto) {
    const user = await this.usersService.updateUser(id, dto);
    return user;
  }

  @Delete()
  @UseGuards(JwtGuard)
  async deleteUser(@GetUser('id') id: number) {
    const user = await this.usersService.deleteUser(id);
    return user;
  }
}
