import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { Income, IncomeCategory, IncomeStatus } from './entities/income.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/role/enums/role.enum';

@ApiTags('income')
@Controller('income')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  @Roles(Role.Admin, Role.CEO)
  @ApiOperation({ summary: 'Create a new income' })
  @ApiResponse({
    status: 201,
    description: 'Income created successfully',
    type: Income,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() createIncomeDto: CreateIncomeDto, @Request() req) {
    return this.incomeService.create(createIncomeDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all income' })
  @ApiQuery({
    name: 'venueId',
    required: false,
    description: 'Filter by venue ID',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter by income category',
  })
  @ApiResponse({
    status: 200,
    description: 'Income retrieved successfully',
    type: [Income],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @Query('venueId') venueId?: string,
    @Query('category') category?: IncomeCategory,
  ) {
    return this.incomeService.findAll(
      venueId ? +venueId : undefined,
      category,
    );
  }

  @Get('venue/:venueId')
  @ApiOperation({ summary: 'Get income by venue' })
  @ApiResponse({
    status: 200,
    description: 'Income retrieved successfully',
    type: [Income],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findByVenue(@Param('venueId') venueId: string) {
    return this.incomeService.findByVenue(+venueId);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get income by category' })
  @ApiResponse({
    status: 200,
    description: 'Income retrieved successfully',
    type: [Income],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findByCategory(@Param('category') category: IncomeCategory) {
    return this.incomeService.findByCategory(category);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get income by status' })
  @ApiResponse({
    status: 200,
    description: 'Income retrieved successfully',
    type: [Income],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findByStatus(@Param('status') status: IncomeStatus) {
    return this.incomeService.findByStatus(status);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending income' })
  @ApiQuery({
    name: 'venueId',
    required: false,
    description: 'Filter by venue ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Pending income retrieved successfully',
    type: [Income],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPendingIncome(@Query('venueId') venueId?: string) {
    return this.incomeService.getPendingIncome(
      venueId ? +venueId : undefined,
    );
  }

  @Get('total/:venueId')
  @ApiOperation({ summary: 'Get total income by venue' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date (YYYY-MM-DD)',
  })
  @ApiResponse({
    status: 200,
    description: 'Total income calculated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTotalIncome(
    @Param('venueId') venueId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.incomeService.getTotalIncomeByVenue(+venueId, start, end);
  }

  @Get('overview')
  @ApiQuery({ name: 'venueId', required: false, description: 'ID del restaurante (opcional)' })
  @ApiQuery({ name: 'year', required: true, example: 2024 })
  @ApiQuery({ name: 'month', required: true, example: 6 })
  async getIncomeOverview(
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

  @Get('venue/:venueId/date-range')
  @ApiOperation({ summary: 'Obtener ingresos de un local en un rango de fechas' })
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

  @Get(':id')
  @ApiOperation({ summary: 'Get income by ID' })
  @ApiResponse({
    status: 200,
    description: 'Income retrieved successfully',
    type: Income,
  })
  @ApiResponse({ status: 404, description: 'Income not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('id') id: string) {
    return this.incomeService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.CEO)
  @ApiOperation({ summary: 'Update income' })
  @ApiResponse({
    status: 200,
    description: 'Income updated successfully',
    type: Income,
  })
  @ApiResponse({ status: 404, description: 'Income not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id') id: string,
    @Body() updateIncomeDto: UpdateIncomeDto,
    @Request() req,
  ) {
    return this.incomeService.update(+id, updateIncomeDto, req.user.id);
  }

  @Patch(':id/mark-received')
  @Roles(Role.Admin, Role.CEO)
  @ApiOperation({ summary: 'Mark income as received' })
  @ApiResponse({
    status: 200,
    description: 'Income marked as received successfully',
    type: Income,
  })
  @ApiResponse({ status: 404, description: 'Income not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async markAsReceived(@Param('id') id: string, @Request() req) {
    return this.incomeService.markAsReceived(+id, req.user.id);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete income' })
  @ApiResponse({ status: 204, description: 'Income deleted successfully' })
  @ApiResponse({ status: 404, description: 'Income not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(@Param('id') id: string) {
    return this.incomeService.remove(+id);
  }

  @Get('categories/all')
  @ApiOperation({ summary: 'Get all income categories' })
  @ApiResponse({
    status: 200,
    description: 'Income categories retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getIncomeCategories() {
    return Object.values(IncomeCategory);
  }

  @Get('statuses/all')
  @ApiOperation({ summary: 'Get all income statuses' })
  @ApiResponse({
    status: 200,
    description: 'Income statuses retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getIncomeStatuses() {
    return Object.values(IncomeStatus);
  }

  // Endpoint de prueba sin autenticación
  @Get('test/summary')
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
}
