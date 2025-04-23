import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import {JwtGuard, AdminGuard} from "@app/shared"

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get(':productId')
  @UseGuards(JwtGuard)
  @UseGuards(AdminGuard)
  async getStock(@Param('productId') productId: string) {
    return this.inventoryService.getStock(parseInt(productId));
  }

  @Patch(':productId')
  @UseGuards(JwtGuard)
  @UseGuards(AdminGuard)
  async adjustStock(
    @Param('productId') productId: string,
    @Body() body: { available: number },
  ) {
    return this.inventoryService.adjustStock(
      parseInt(productId),
      body.available,
    );
  }
}

