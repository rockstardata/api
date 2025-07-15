import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { ApiQuery, ApiOperation } from '@nestjs/swagger';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get('summary')
  getSalesSummary(
    @Query('venueId') venueId?: string,
  ) {
    return this.salesService.getSalesSummary(
      venueId ? parseInt(venueId) : undefined,
    );
  }

  @Get('venue/:venueId')
  findByVenue(@Param('venueId') venueId: string) {
    return this.salesService.findByVenue(+venueId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.salesService.findByUser(+userId);
  }

  @Get('test-date-query')
  testDateQuery() {
    return this.salesService.getSalesFromYearStartToNextMonth();
  }
  @Get('by-month')
  @ApiOperation({ summary: 'Obtener ventas por mes y año paginadas de 10 en 10', description: 'Ejemplo: /sales/by-month?month=6&year=2024&page=1' })
  @ApiQuery({ name: 'month', required: true, example: 6, description: 'Número del mes (ej: 6 para junio)' })
  @ApiQuery({ name: 'year', required: true, example: 2024, description: 'Año (ej: 2024)' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Número de página (opcional, por defecto 1)' })
  getSalesByMonthAndYear(
    @Query('month') month: string,
    @Query('year') year: string,
    @Query('page') page?: string,
  ) {
    return this.salesService.getSalesByMonthAndYear(
      parseInt(month),
      parseInt(year),
      page ? parseInt(page) : 1
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(+id, updateSaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(+id);
  }
}