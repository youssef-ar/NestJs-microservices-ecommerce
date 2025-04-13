export class OrderResponseDto {
    id: string;
    userId: string;
    status: string;
    total: number;
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
  }