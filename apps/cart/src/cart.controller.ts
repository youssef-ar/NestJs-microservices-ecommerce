import { Controller, Get } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async addProductToCart(session: string, productId: number, quantity: number) {
    return this.cartService.addProductToCart(session, productId, quantity);
  }
}
