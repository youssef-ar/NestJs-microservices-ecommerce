// apps/orders/src/orders.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto.userId, dto);
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.ordersService.getOrder(id);
  }
}