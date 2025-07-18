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
  @ApiOperation({ 
    summary: 'Create a new agreement',
    description: 'Create a new agreement between a venue and a client (Admin and CEO only)'
  })
  @ApiResponse({ status: 201, description: 'Agreement created successfully', type: Agreement })
  @ApiResponse({ status: 400, description: 'Bad request - invalid agreement data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - authentication required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or CEO role required' })
  async create(@Body() createAgreementDto: CreateAgreementDto, @Request() req) {
    return this.agreementsService.create(createAgreementDto, req.user.id);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all agreements',
    description: 'Retrieve a list of all agreements, optionally filtered by venue ID'
  })
  @ApiQuery({ name: 'venueId', required: false, description: 'Filter by venue ID' })
  @ApiResponse({ status: 200, description: 'Agreements retrieved successfully', type: [Agreement] })
  @ApiResponse({ status: 401, description: 'Unauthorized - authentication required' })
  async findAll(@Query('venueId') venueId?: string) {
    return this.agreementsService.findAll(venueId ? +venueId : undefined);
  }

  @Get('venue/:venueId')
  @ApiOperation({ 
    summary: 'Get agreements by venue',
    description: 'Retrieve all agreements for a specific venue'
  })
  @ApiResponse({ status: 200, description: 'Agreements retrieved successfully', type: [Agreement] })
  @ApiResponse({ status: 401, description: 'Unauthorized - authentication required' })
  async findByVenue(@Param('venueId') venueId: string) {
    return this.agreementsService.findByVenue(+venueId);
  }

  @Get('status/:status')
  @ApiOperation({ 
    summary: 'Get agreements by status',
    description: 'Retrieve all agreements with a specific status (active, expired, pending, etc.)'
  })
  @ApiResponse({ status: 200, description: 'Agreements retrieved successfully', type: [Agreement] })
  @ApiResponse({ status: 401, description: 'Unauthorized - authentication required' })
  async findByStatus(@Param('status') status: AgreementStatus) {
    return this.agreementsService.findByStatus(status);
  }

  @Get('expiring')
  @ApiOperation({ 
    summary: 'Get agreements expiring soon',
    description: 'Retrieve agreements that are expiring within a specified number of days'
  })
  @ApiQuery({ name: 'days', required: false, description: 'Days to look ahead (default: 30)' })
  @ApiResponse({ status: 200, description: 'Expiring agreements retrieved successfully', type: [Agreement] })
  @ApiResponse({ status: 401, description: 'Unauthorized - authentication required' })
  async getExpiringAgreements(@Query('days') days?: string) {
    return this.agreementsService.getExpiringAgreements(days ? +days : 30);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get agreement by ID',
    description: 'Retrieve a specific agreement by its unique identifier'
  })
  @ApiResponse({ status: 200, description: 'Agreement retrieved successfully', type: Agreement })
  @ApiResponse({ status: 404, description: 'Agreement not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - authentication required' })
  async findOne(@Param('id') id: string) {
    return this.agreementsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.CEO)
  @ApiOperation({ 
    summary: 'Update agreement',
    description: 'Update an existing agreement with new information (Admin and CEO only)'
  })
  @ApiResponse({ status: 200, description: 'Agreement updated successfully', type: Agreement })
  @ApiResponse({ status: 404, description: 'Agreement not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - authentication required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or CEO role required' })
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
  @ApiOperation({ 
    summary: 'Delete agreement',
    description: 'Remove an agreement from the system (Admin only)'
  })
  @ApiResponse({ status: 204, description: 'Agreement deleted successfully' })
  @ApiResponse({ status: 404, description: 'Agreement not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - authentication required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async remove(@Param('id') id: string) {
    return this.agreementsService.remove(+id);
  }

  @Get('types/all')
  @ApiOperation({ 
    summary: 'Get all agreement types',
    description: 'Retrieve all available agreement types (rental, service, partnership, etc.)'
  })
  @ApiResponse({ status: 200, description: 'Agreement types retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - authentication required' })
  async getAgreementTypes() {
    return Object.values(AgreementType);
  }

  @Get('statuses/all')
  @ApiOperation({ 
    summary: 'Get all agreement statuses',
    description: 'Retrieve all available agreement statuses (active, expired, pending, etc.)'
  })
  @ApiResponse({ status: 200, description: 'Agreement statuses retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - authentication required' })
  async getAgreementStatuses() {
    return Object.values(AgreementStatus);
  }
}
