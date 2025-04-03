import { Controller, Delete, Get, Patch, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { CartService } from './cart.service';
const session = require('express-session');

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async addProductToCart(
    @Req() request: Request,
    @Query('productId') product: string,
    @Query('quantity') productQuantity: string,
  ) {

    const sessionId = request.sessionID;
    const productId = parseInt(product, 10);
    const quantity = parseInt(productQuantity, 10);

    return this.cartService.addProductToCart(sessionId, productId, quantity);
  }

  @Delete()
  async removeProductFromCart(
    @Req() request: Request,
    @Query('productId') product: string
    ) {
    const sessionId = request.sessionID;
    const productId = parseInt(product, 10);

    return this.cartService.removeProductFromCart(sessionId, productId);
  }

  @Get()
  async getCart(@Req() request: Request) {
    const sessionId = request.sessionID;
    return this.cartService.getCart(sessionId);
  }

  @Patch()
  async clearCart(@Req() request: Request) {
    const sessionId = request.sessionID;
    return this.cartService.clearCart(sessionId);
  }

  @Patch()
  async updateProductQuantity(
    @Req() request: Request,
    @Query('productId') product: string,
    @Query('quantity') productQuantity: string
    ) {
    const sessionId = request.sessionID;
    const productId = parseInt(product, 10);
    const quantity = parseInt(productQuantity, 10);
    return this.cartService.updateProductQuantity(sessionId, productId, quantity);
    }
}
