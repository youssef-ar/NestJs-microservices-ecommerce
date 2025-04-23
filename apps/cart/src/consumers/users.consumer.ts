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
    console.log('User created event received:', event);
    const userId = parseInt(event.userId, 10); 
    await this.cartService.createEmptyCart(userId);
    console.log('Empty cart created for user:', event.userId);
  }

  @RabbitRPC({
    exchange: 'users',
    routingKey: 'user.deleted',
    queue: 'cart_users_queue'
  })
  async handleUserDeleted(event: { userId: string }) {
    const userId = parseInt(event.userId, 10); 
    await this.cartService.deleteCart(userId);
  }
}