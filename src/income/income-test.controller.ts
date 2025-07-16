import {
  Controller,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { IncomeService } from './income.service';

@ApiTags('income-test')
@Controller('income-test')
export class IncomeTestController {
  constructor(private readonly incomeService: IncomeService) { }

  @Get('summary')
  @ApiOperation({ summary: 'Test income summary without authentication' })
  @ApiQuery({ name: 'venueId', required: false, description: 'ID del restaurante (opcional)' })
  @ApiQuery({ name: 'year', required: true, example: 2024 })
  @ApiQuery({ name: 'month', required: true, example: 6 })
  async testIncomeSummary(
    @Query('venueId') venueId?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    return this.incomeService.getIncomeOverview(
      venueId ? +venueId : undefined,
      Number(year),
      Number(month)
    );
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all income records without authentication' })
  async getAllIncome() {
    return this.incomeService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get income statistics without authentication' })
  async getIncomeStats() {
    const allIncome = await this.incomeService.findAll();
    const totalAmount = allIncome.reduce((sum, income) => sum + Number(income.amount), 0);

    return {
      totalRecords: allIncome.length,
      totalAmount: totalAmount,
      averageAmount: allIncome.length > 0 ? totalAmount / allIncome.length : 0,
      venues: [...new Set(allIncome.map(income => income.venue?.id).filter(Boolean))],
    };
  }

  @Get('venue/:venueId/date-range')
  @ApiOperation({ summary: 'Get income by date range without authentication' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Fecha de inicio (YYYY-MM-DD)', example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', required: true, description: 'Fecha de fin (YYYY-MM-DD)', example: '2024-12-31' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Registros por página', example: 50 })
  async getIncomeByDateRange(
    @Param('venueId') venueId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.incomeService.getIncomeByDateRange(
      +venueId,
      startDate,
      endDate,
      page ? +page : 1,
      limit ? +limit : 50
    );
  }
} 