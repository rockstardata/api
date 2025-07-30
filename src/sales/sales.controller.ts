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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@ApiTags('sales')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new sale',
    description:
      'Create a new sale record with product information and pricing',
  })
  @ApiBody({ type: CreateSaleDto })
  @ApiResponse({
    status: 201,
    description: 'Sale created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid sale data',
  })
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all sales',
    description: 'Retrieve a list of all sales in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'List of sales retrieved successfully',
  })
  findAll() {
    return this.salesService.findAll();
  }

  @Get('summary')
  getSalesSummary(@Query('venueId') venueId?: string) {
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
  @ApiOperation({
    summary: 'Obtener ventas por mes y año paginadas de 10 en 10',
    description: 'Ejemplo: /sales/by-month?month=6&year=2024&page=1',
  })
  @ApiQuery({
    name: 'month',
    required: true,
    example: 6,
    description: 'Número del mes (ej: 6 para junio)',
  })
  @ApiQuery({
    name: 'year',
    required: true,
    example: 2024,
    description: 'Año (ej: 2024)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Número de página (opcional, por defecto 1)',
  })
  getSalesByMonthAndYear(
    @Query('month') month: string,
    @Query('year') year: string,
    @Query('page') page?: string,
  ) {
    return this.salesService.getSalesByMonthAndYear(
      parseInt(month),
      parseInt(year),
      page ? parseInt(page) : 1,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get sale by ID',
    description: 'Retrieve a specific sale by its unique identifier',
  })
  @ApiParam({ name: 'id', description: 'Sale ID' })
  @ApiResponse({
    status: 200,
    description: 'Sale found and retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Sale not found',
  })
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update sale',
    description: 'Update an existing sale with new information',
  })
  @ApiParam({ name: 'id', description: 'Sale ID' })
  @ApiBody({ type: UpdateSaleDto })
  @ApiResponse({
    status: 200,
    description: 'Sale updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Sale not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid update data',
  })
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(+id, updateSaleDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete sale',
    description: 'Remove a sale from the system (soft delete)',
  })
  @ApiParam({ name: 'id', description: 'Sale ID' })
  @ApiResponse({
    status: 200,
    description: 'Sale deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Sale not found',
  })
  remove(@Param('id') id: string) {
    return this.salesService.remove(+id);
  }
}
