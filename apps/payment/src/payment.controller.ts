import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AdminGuard } from '@app/shared';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get(':orderId')
  async getPaymentStatus(@Param('orderId') orderId: string) {
    return this.paymentService.getPaymentStatus(orderId);
  }

  @Post('refund/:orderId')
  @UseGuards(AdminGuard)
  async refundPayment(@Param('orderId') orderId: string) {
    return this.paymentService.handleRefund(orderId);
  }
}