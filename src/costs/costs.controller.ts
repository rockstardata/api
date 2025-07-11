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
import { CostsService } from './costs.service';
import { CreateCostDto } from './dto/create-cost.dto';
import { UpdateCostDto } from './dto/update-cost.dto';
import { Cost, CostCategory, CostFrequency } from './entities/cost.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/role/enums/role.enum';

@ApiTags('costs')
@Controller('costs')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class CostsController {
  constructor(private readonly costsService: CostsService) {}

  @Post()
  @Roles(Role.Admin, Role.CEO)
  @ApiOperation({ summary: 'Create a new cost' })
  @ApiResponse({ status: 201, description: 'Cost created successfully', type: Cost })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() createCostDto: CreateCostDto, @Request() req) {
    return this.costsService.create(createCostDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all costs' })
  @ApiQuery({ name: 'venueId', required: false, description: 'Filter by venue ID' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by cost category' })
  @ApiResponse({ status: 200, description: 'Costs retrieved successfully', type: [Cost] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @Query('venueId') venueId?: string,
    @Query('category') category?: CostCategory,
  ) {
    return this.costsService.findAll(
      venueId ? +venueId : undefined,
      category,
    );
  }

  @Get('venue/:venueId')
  @ApiOperation({ summary: 'Get costs by venue' })
  @ApiResponse({ status: 200, description: 'Costs retrieved successfully', type: [Cost] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findByVenue(@Param('venueId') venueId: string) {
    return this.costsService.findByVenue(+venueId);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get costs by category' })
  @ApiResponse({ status: 200, description: 'Costs retrieved successfully', type: [Cost] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findByCategory(@Param('category') category: CostCategory) {
    return this.costsService.findByCategory(category);
  }

  @Get('unpaid')
  @ApiOperation({ summary: 'Get unpaid costs' })
  @ApiQuery({ name: 'venueId', required: false, description: 'Filter by venue ID' })
  @ApiResponse({ status: 200, description: 'Unpaid costs retrieved successfully', type: [Cost] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUnpaidCosts(@Query('venueId') venueId?: string) {
    return this.costsService.getUnpaidCosts(venueId ? +venueId : undefined);
  }

  @Get('total/:venueId')
  @ApiOperation({ summary: 'Get total costs by venue' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Total costs calculated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTotalCosts(
    @Param('venueId') venueId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.costsService.getTotalCostsByVenue(+venueId, start, end);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cost by ID' })
  @ApiResponse({ status: 200, description: 'Cost retrieved successfully', type: Cost })
  @ApiResponse({ status: 404, description: 'Cost not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('id') id: string) {
    return this.costsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.CEO)
  @ApiOperation({ summary: 'Update cost' })
  @ApiResponse({ status: 200, description: 'Cost updated successfully', type: Cost })
  @ApiResponse({ status: 404, description: 'Cost not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id') id: string,
    @Body() updateCostDto: UpdateCostDto,
    @Request() req,
  ) {
    return this.costsService.update(+id, updateCostDto, req.user.id);
  }

  @Patch(':id/mark-paid')
  @Roles(Role.Admin, Role.CEO)
  @ApiOperation({ summary: 'Mark cost as paid' })
  @ApiResponse({ status: 200, description: 'Cost marked as paid successfully', type: Cost })
  @ApiResponse({ status: 404, description: 'Cost not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async markAsPaid(@Param('id') id: string, @Request() req) {
    return this.costsService.markAsPaid(+id, req.user.id);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete cost' })
  @ApiResponse({ status: 204, description: 'Cost deleted successfully' })
  @ApiResponse({ status: 404, description: 'Cost not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(@Param('id') id: string) {
    return this.costsService.remove(+id);
  }

  @Get('categories/all')
  @ApiOperation({ summary: 'Get all cost categories' })
  @ApiResponse({ status: 200, description: 'Cost categories retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCostCategories() {
    return Object.values(CostCategory);
  }

  @Get('frequencies/all')
  @ApiOperation({ summary: 'Get all cost frequencies' })
  @ApiResponse({ status: 200, description: 'Cost frequencies retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCostFrequencies() {
    return Object.values(CostFrequency);
  }
}
