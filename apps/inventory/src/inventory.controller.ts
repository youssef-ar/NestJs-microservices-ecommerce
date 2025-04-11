import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get(':productId')
  async getStock(@Param('productId') productId: string) {
    return this.inventoryService.getStock(parseInt(productId));
  }

  @Patch(':productId')
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