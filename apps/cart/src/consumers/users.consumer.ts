import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { CartService } from '../cart.service';

@Injectable()
export class UsersConsumer {
  constructor(private readonly cartService: CartService) {}

  @RabbitRPC({
    exchange: 'users',
    routingKey: 'user.created',
    queue: 'cart_users_queue'
  })
  async handleUserCreated(event: { userId: string; email: string }) {
    await this.cartService.createEmptyCart(event.userId);
  }

  @RabbitRPC({
    exchange: 'users',
    routingKey: 'user.deleted',
    queue: 'cart_users_queue'
  })
  async handleUserDeleted(event: { userId: string }) {
    await this.cartService.deleteCart(event.userId);
  }
}