// apps/orders/src/orders.controller.ts
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import {JwtGuard} from "@app/shared"

@Controller('')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtGuard)
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto.userId, dto);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getOrder(@Param('id') id: string) {
    return this.ordersService.getOrder(id);
  }
}