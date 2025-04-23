import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CartService } from './cart.service';
import {JwtGuard} from "@app/shared"

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  private getIdentity(req: Request) {
    if (req.user && req.user.id) {
      return { userId: String(req.user.id)  };
    }
    return { session: req.sessionID || "" };
  }

  @Post()
  @UseGuards(JwtGuard)
  async addProductToCart(
    @Req() request: Request,
    @Query('productId') product: string,
    @Query('quantity') productQuantity: string,
  ) {
    const identity = this.getIdentity(request);
    const productId = parseInt(product, 10);
    const quantity = parseInt(productQuantity, 10);

    return this.cartService.addProductToCart(identity, productId, quantity);
  }

  @Delete()
  @UseGuards(JwtGuard)
  async removeProductFromCart(
    @Req() request: Request,
    @Query('productId') product: string,
  ) {
    const identity = this.getIdentity(request);
    const productId = parseInt(product, 10);

    return this.cartService.removeProductFromCart(identity, productId);
  }

  @Get()
  @UseGuards(JwtGuard)
  async getCart(@Req() request: Request) {
    const identity = this.getIdentity(request);
    return this.cartService.getCart(identity);
  }

  @Patch('clear')
  @UseGuards(JwtGuard)
  async clearCart(@Req() request: Request) {
    const identity = this.getIdentity(request);
    return this.cartService.clearCart(identity);
  }

  @Patch('update')
  @UseGuards(JwtGuard)
  async updateProductQuantity(
    @Req() request: Request,
    @Query('productId') product: string,
    @Query('quantity') productQuantity: string,
  ) {
    const identity = this.getIdentity(request);
    const productId = parseInt(product, 10);
    const quantity = parseInt(productQuantity, 10);

    return this.cartService.updateProductQuantity(
      identity,
      productId,
      quantity,
    );
  }
}
