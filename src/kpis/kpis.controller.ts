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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { KpisService } from './kpis.service';
import { CreateKpiDto } from './dto/create-kpi.dto';
import { UpdateKpiDto } from './dto/update-kpi.dto';
import { Kpi, KpiType, KpiPeriod } from './entities/kpi.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/role/enums/role.enum';

@ApiTags('kpis')
@Controller('kpis')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class KpisController {
  constructor(private readonly kpisService: KpisService) {}

  @Post()
  @Roles(Role.Admin, Role.CEO)
  @ApiOperation({ summary: 'Create a new KPI' })
  @ApiResponse({ status: 201, description: 'KPI created successfully', type: Kpi })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() createKpiDto: CreateKpiDto, @Request() req) {
    return this.kpisService.create(createKpiDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all KPIs' })
  @ApiQuery({ name: 'venueId', required: false, description: 'Filter by venue ID' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by KPI type' })
  @ApiResponse({ status: 200, description: 'KPIs retrieved successfully', type: [Kpi] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @Query('venueId') venueId?: string,
    @Query('type') type?: KpiType,
  ) {
    return this.kpisService.findAll(
      venueId ? +venueId : undefined,
      type,
    );
  }

  @Get('venue/:venueId')
  @ApiOperation({ summary: 'Get KPIs by venue' })
  @ApiResponse({ status: 200, description: 'KPIs retrieved successfully', type: [Kpi] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findByVenue(@Param('venueId') venueId: string) {
    return this.kpisService.findByVenue(+venueId);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get KPIs by type' })
  @ApiResponse({ status: 200, description: 'KPIs retrieved successfully', type: [Kpi] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findByType(@Param('type') type: KpiType) {
    return this.kpisService.findByType(type);
  }

  @Get('period/:period')
  @ApiOperation({ summary: 'Get KPIs by period' })
  @ApiResponse({ status: 200, description: 'KPIs retrieved successfully', type: [Kpi] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findByPeriod(@Param('period') period: KpiPeriod) {
    return this.kpisService.findByPeriod(period);
  }

  @Get('overdue')
  @ApiOperation({ summary: 'Get overdue KPIs' })
  @ApiQuery({ name: 'venueId', required: false, description: 'Filter by venue ID' })
  @ApiResponse({ status: 200, description: 'Overdue KPIs retrieved successfully', type: [Kpi] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getOverdueKpis(@Query('venueId') venueId?: string) {
    return this.kpisService.getOverdueKpis(venueId ? +venueId : undefined);
  }

  @Get('performance/:venueId')
  @ApiOperation({ summary: 'Get KPI performance by venue' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by KPI type' })
  @ApiResponse({ status: 200, description: 'KPI performance calculated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getKpiPerformance(
    @Param('venueId') venueId: string,
    @Query('type') type?: KpiType,
  ) {
    return this.kpisService.getKpiPerformance(+venueId, type);
  }

  @Get('top-performers/:venueId')
  @ApiOperation({ summary: 'Get top performing KPIs' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of top performers (default: 5)' })
  @ApiResponse({ status: 200, description: 'Top performers retrieved successfully', type: [Kpi] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTopPerformers(
    @Param('venueId') venueId: string,
    @Query('limit') limit?: string,
  ) {
    return this.kpisService.getTopPerformers(+venueId, limit ? +limit : 5);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get KPI by ID' })
  @ApiResponse({ status: 200, description: 'KPI retrieved successfully', type: Kpi })
  @ApiResponse({ status: 404, description: 'KPI not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('id') id: string) {
    return this.kpisService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.CEO)
  @ApiOperation({ summary: 'Update KPI' })
  @ApiResponse({ status: 200, description: 'KPI updated successfully', type: Kpi })
  @ApiResponse({ status: 404, description: 'KPI not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id') id: string,
    @Body() updateKpiDto: UpdateKpiDto,
    @Request() req,
  ) {
    return this.kpisService.update(+id, updateKpiDto, req.user.id);
  }

  @Patch(':id/actual-value')
  @Roles(Role.Admin, Role.CEO)
  @ApiOperation({ summary: 'Update KPI actual value' })
  @ApiResponse({ status: 200, description: 'KPI actual value updated successfully', type: Kpi })
  @ApiResponse({ status: 404, description: 'KPI not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateActualValue(
    @Param('id') id: string,
    @Body('actualValue') actualValue: number,
  ) {
    return this.kpisService.updateActualValue(+id, actualValue);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete KPI' })
  @ApiResponse({ status: 204, description: 'KPI deleted successfully' })
  @ApiResponse({ status: 404, description: 'KPI not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(@Param('id') id: string) {
    return this.kpisService.remove(+id);
  }

  @Get('types/all')
  @ApiOperation({ summary: 'Get all KPI types' })
  @ApiResponse({ status: 200, description: 'KPI types retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getKpiTypes() {
    return Object.values(KpiType);
  }

  @Get('periods/all')
  @ApiOperation({ summary: 'Get all KPI periods' })
  @ApiResponse({ status: 200, description: 'KPI periods retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getKpiPeriods() {
    return Object.values(KpiPeriod);
  }
}
