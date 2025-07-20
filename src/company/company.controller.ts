import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@ApiTags('companies')
@ApiBearerAuth()
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new company',
    description: 'Create a new company entity associated with the authenticated user'
  })
  @ApiBody({ type: CreateCompanyDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Company created successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - invalid company data' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - authentication required' 
  })
  create(@Body() createCompanyDto: CreateCompanyDto, @Request() req) {
    return this.companyService.create(createCompanyDto, req.user?.id);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all companies',
    description: 'Retrieve a list of all companies in the system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of companies retrieved successfully' 
  })
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get company by ID',
    description: 'Retrieve a specific company by its unique identifier'
  })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Company found and retrieved successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Company not found' 
  })
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update company',
    description: 'Update an existing company with new information'
  })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiBody({ type: UpdateCompanyDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Company updated successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Company not found' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - invalid update data' 
  })
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete company',
    description: 'Remove a company from the system (soft delete)'
  })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Company deleted successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Company not found' 
  })
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }

  @Get('organization/:organizationId')
  @ApiOperation({ 
    summary: 'Get companies by organization',
    description: 'Retrieve all companies belonging to a specific organization'
  })
  @ApiParam({ name: 'organizationId', description: 'Organization ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Companies for organization retrieved successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Organization not found' 
  })
  findByOrganization(@Param('organizationId') organizationId: string) {
    return this.companyService.findByOrganization(+organizationId);
  }
} 