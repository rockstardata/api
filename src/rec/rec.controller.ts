import { Controller, Get, Param, Query } from '@nestjs/common';
import { RecService, PaymentSummary } from './rec.service';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly recService: RecService) {}

  @Get('tab/:tabId/sum')
  @ApiOperation({
    summary: 'Sum payments for a specific tab',
    description: 'Retrieves a tab and calculates the sum of all payment amounts'
  })
  @ApiParam({
    name: 'tabId',
    description: 'ID of the tab to query',
    example: '8fb95851-e399-49dc-93ed-42480b653762'
  })
  @ApiQuery({
    name: 'locationId',
    required: true,
    description: 'Location ID associated with the tab',
    example: 'c672e0e5-5dea-45ab-94b0-e67f396f355c'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the sum of payments',
    schema: {
      example: {
        tabId: '8fb95851-e399-49dc-93ed-42480b653762',
        totalAmount: 150,
        paymentCount: 1,
        payments: [
          {
            amount: 150,
            type: 'card'
          }
        ]
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Missing required parameters'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error'
  })
  async sumTabPayments(
    @Param('tabId') tabId: string,
    @Query('locationId') locationId: string
  ): Promise<PaymentSummary> {
    if (!tabId || !locationId) {
      throw new Error('Tab ID and Location ID are required');
    }

    return this.recService.calculatePayments(tabId, locationId);
  }
}