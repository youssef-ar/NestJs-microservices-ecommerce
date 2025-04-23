import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async createEmptyCart(userId: number) {
    try {
      const cart = await this.prisma.cart.create({
        data: {
          userId,
          session: '',
          cartItems: {
            create: [],
          },
        },
      });
      return cart;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteCart(userId: number) {
    try {
      await this.prisma.cart.deleteMany({ where: { userId } });
    } catch (error) {
      throw new Error(error);
    }
  }

  async addProductToCart({ session, userId }: { session?: string; userId?: string }, productId: number, quantity: number) {
    try {
      const whereClause = userId ? { userId } : { session };

      let cart = await this.prisma.cart.findFirst({
        where: whereClause,
        include: { cartItems: true },
      });

      if (!cart) {
        cart = await this.prisma.cart.create({
          data: {
            userId: userId || undefined,
            session: session || '',
            cartItems: {
              create: [{ productId, quantity }],
            },
          },
          include: { cartItems: true },
        });
      } else {
        const existingItem = cart.cartItems.find((item) => item.productId === productId);
        if (existingItem) {
          await this.prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + quantity },
          });
        } else {
          await this.prisma.cartItem.create({
            data: { cartId: cart.id, productId, quantity },
          });
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async removeProductFromCart({ session, userId }: { session?: string; userId?: string }, productId: number) {
    try {
      const whereClause = userId ? { userId } : { session };

      const cart = await this.prisma.cart.findFirst({
        where: whereClause,
        include: { cartItems: true },
      });

      if (!cart) throw new Error('Cart not found');

      const cartItem = cart.cartItems.find((item) => item.productId === productId);
      if (!cartItem) throw new Error('Product not found in cart');

      await this.prisma.cartItem.delete({ where: { id: cartItem.id } });
    } catch (error) {
      throw new Error(error);
    }
  }

  async getCart({ session, userId }: { session?: string; userId?: string }) {
    try {
      const whereClause = userId ? { userId } : { session };

      const cart = await this.prisma.cart.findFirst({
        where: whereClause,
        include: { cartItems: true },
      });

      if (!cart) throw new Error('Cart not found');

      return cart;
    } catch (error) {
      throw new Error(error);
    }
  }

  async clearCart({ session, userId }: { session?: string; userId?: string }) {
    try {
      const whereClause = userId ? { userId } : { session };

      const cart = await this.prisma.cart.findFirst({
        where: whereClause,
        include: { cartItems: true },
      });

      if (!cart) throw new Error('Cart not found');

      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateProductQuantity({ session, userId }: { session?: string; userId?: string }, productId: number, quantity: number) {
    try {
      const whereClause = userId ? { userId } : { session };

      const cart = await this.prisma.cart.findFirst({
        where: whereClause,
        include: { cartItems: true },
      });

      if (!cart) throw new Error('Cart not found');

      const cartItem = cart.cartItems.find((item) => item.productId === productId);
      if (!cartItem) throw new Error('Product not found in cart');

      await this.prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
