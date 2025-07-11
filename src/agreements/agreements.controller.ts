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
import { AgreementsService } from './agreements.service';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { UpdateAgreementDto } from './dto/update-agreement.dto';
import { Agreement, AgreementStatus, AgreementType } from './entities/agreement.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/role/enums/role.enum';

@ApiTags('agreements')
@Controller('agreements')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class AgreementsController {
  constructor(private readonly agreementsService: AgreementsService) {}

  @Post()
  @Roles(Role.Admin, Role.CEO)
  @ApiOperation({ summary: 'Create a new agreement' })
  @ApiResponse({ status: 201, description: 'Agreement created successfully', type: Agreement })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() createAgreementDto: CreateAgreementDto, @Request() req) {
    return this.agreementsService.create(createAgreementDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all agreements' })
  @ApiQuery({ name: 'venueId', required: false, description: 'Filter by venue ID' })
  @ApiResponse({ status: 200, description: 'Agreements retrieved successfully', type: [Agreement] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query('venueId') venueId?: string) {
    return this.agreementsService.findAll(venueId ? +venueId : undefined);
  }

  @Get('venue/:venueId')
  @ApiOperation({ summary: 'Get agreements by venue' })
  @ApiResponse({ status: 200, description: 'Agreements retrieved successfully', type: [Agreement] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findByVenue(@Param('venueId') venueId: string) {
    return this.agreementsService.findByVenue(+venueId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get agreements by status' })
  @ApiResponse({ status: 200, description: 'Agreements retrieved successfully', type: [Agreement] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findByStatus(@Param('status') status: AgreementStatus) {
    return this.agreementsService.findByStatus(status);
  }

  @Get('expiring')
  @ApiOperation({ summary: 'Get agreements expiring soon' })
  @ApiQuery({ name: 'days', required: false, description: 'Days to look ahead (default: 30)' })
  @ApiResponse({ status: 200, description: 'Expiring agreements retrieved successfully', type: [Agreement] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getExpiringAgreements(@Query('days') days?: string) {
    return this.agreementsService.getExpiringAgreements(days ? +days : 30);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get agreement by ID' })
  @ApiResponse({ status: 200, description: 'Agreement retrieved successfully', type: Agreement })
  @ApiResponse({ status: 404, description: 'Agreement not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('id') id: string) {
    return this.agreementsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.CEO)
  @ApiOperation({ summary: 'Update agreement' })
  @ApiResponse({ status: 200, description: 'Agreement updated successfully', type: Agreement })
  @ApiResponse({ status: 404, description: 'Agreement not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id') id: string,
    @Body() updateAgreementDto: UpdateAgreementDto,
    @Request() req,
  ) {
    return this.agreementsService.update(+id, updateAgreementDto, req.user.id);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete agreement' })
  @ApiResponse({ status: 204, description: 'Agreement deleted successfully' })
  @ApiResponse({ status: 404, description: 'Agreement not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(@Param('id') id: string) {
    return this.agreementsService.remove(+id);
  }

  @Get('types/all')
  @ApiOperation({ summary: 'Get all agreement types' })
  @ApiResponse({ status: 200, description: 'Agreement types retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAgreementTypes() {
    return Object.values(AgreementType);
  }

  @Get('statuses/all')
  @ApiOperation({ summary: 'Get all agreement statuses' })
  @ApiResponse({ status: 200, description: 'Agreement statuses retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAgreementStatuses() {
    return Object.values(AgreementStatus);
  }
}
