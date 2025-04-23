import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UpdateDto } from './dto/update.dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private jwtService: JwtService, private config: ConfigService ,private readonly amqp: AmqpConnection) {}
  // sign up
 async signUp(dto: AuthDto) {
    try{

      const hash = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
    });
    this.amqp.publish('users', 'user.created', {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt
    });
    console.log('User created', user);
    const { hash: _, ...result } = user;
    return result;

    }
    catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
        if(error.code === 'P2004'){
          throw new ForbiddenException('Password is not strong enough');
        }
        throw error;
        }
  }
    


 };
  // sign in
  async signIn(dto: AuthDto): Promise<{access_token: string}> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!(await argon.verify(user.hash, dto.password))) {
      throw new ForbiddenException('Invalid password');
    }
    const payload = {sub: user.id, email: user.email};
    const secret = this.config.get('JWT_SECRET');

    return{
      access_token: await this.jwtService.signAsync(
        payload,
        {expiresIn: '1d',
        secret: secret,
        }
      ),
    }
  }

  // get current user
  async getCurrentUser(id: number) {

    const user= await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const {hash: _, ...result } = user;
    return result;
  }

  // update user

  async updateUser(id: number, dto: UpdateDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ... dto,
      },
    });
    const { hash: _, ...result } = updatedUser;
    return result;
  }

  // delete user
  async deleteUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
    this.amqp.publish('users', 'user.deleted', { userId: id });
    return user;
  }

}
