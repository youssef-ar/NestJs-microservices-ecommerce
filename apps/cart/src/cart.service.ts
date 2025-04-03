import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // Add a product to the cart
  async addProductToCart(session: string, productId: number, quantity: number) {
    try {
      
      // find cart by session
      let cart = await this.prisma.cart.findFirst({
        where: { session },
        include: { cartItems: true },
      });
  
      if (!cart) {
        //Create a new cart if not found
        cart = await this.prisma.cart.create({
          data: {
            session,
            cartItems: {
              create: [{ productId, quantity }],
            },
          },
          include: { cartItems: true },
        });
      } else {
        // Check if the product already exists in the cart
        const existingItem = cart.cartItems.find((item) => item.productId === productId);
  
        if (existingItem) {
          // Update the quantity if the product is already in the cart
          await this.prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + quantity },
          });
        } else {
          // Add new product to cart
          await this.prisma.cartItem.create({
            data: { cartId: cart.id, productId, quantity },
          });
        }
      }
  
    } catch (error) {
      throw new Error(error);
    }
  }
      
    
  // Remove a product from the cart
  async removeProductFromCart(session: string, productId: number) {
    try {
      // Find the cart
      const cart = await this.prisma.cart.findFirst({
        where: { session },
        include: { cartItems: true },
      });
  
      if (!cart) {
        throw new Error('Cart not found');
      }
  
      // Find the cart item
      const cartItem = cart.cartItems.find((item) => item.productId === productId);
  
      if (!cartItem) {
        throw new Error('Product not found in cart');
      }
  
      // Remove the product from the cart
      await this.prisma.cartItem.delete({ where: { id: cartItem.id } });
    } catch (error) {
      throw new Error(error);
    }
  }

  // Get the cart
  async getCart(session: string) {
    try {
      console.log(session);
      // Find the cart
      const cart = await this.prisma.cart.findFirst({
        where: { session },
        include: { cartItems: true },
      });
      
      if (!cart) {
        throw new Error('Cart not found');
      }
  
      return cart;
    } catch (error) {
      throw new Error(error);
  }}

  // Clear the cart

  async clearCart(session: string) {
    try {
      // Find the cart
      const cart = await this.prisma.cart.findFirst({
        where: { session },
        include: { cartItems: true },
      });
  
      if (!cart) {
        throw new Error('Cart not found');
      }
  
      // Remove all products from the cart
      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    } catch (error) {
      throw new Error(error);
    }
  }

  // update the quantity of a product in the cart

  async updateProductQuantity(session: string, productId: number, quantity: number) {
    try {
      // Find the cart
      const cart = await this.prisma.cart.findFirst({
        where: { session },
        include: { cartItems: true },
      });
  
      if (!cart) {
        throw new Error('Cart not found');
      }
  
      // Find the cart item
      const cartItem = cart.cartItems.find((item) => item.productId === productId);
  
      if (!cartItem) {
        throw new Error('Product not found in cart');
      }
  
      // Update the quantity of the product
      await this.prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity },
      });
    } catch (error) {
      throw new Error(error);
    }
  }


}
