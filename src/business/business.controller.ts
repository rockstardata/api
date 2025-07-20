import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@ApiTags('business')
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new business',
    description: 'Create a new business entity with the provided information'
  })
  @ApiBody({ type: CreateBusinessDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Business created successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - invalid business data' 
  })
  create(@Body() createBusinessDto: CreateBusinessDto) {
    return this.businessService.create(createBusinessDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all businesses',
    description: 'Retrieve a list of all businesses in the system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of businesses retrieved successfully' 
  })
  findAll() {
    return this.businessService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get business by ID',
    description: 'Retrieve a specific business by its unique identifier'
  })
  @ApiParam({ name: 'id', description: 'Business ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Business found and retrieved successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Business not found' 
  })
  findOne(@Param('id') id: string) {
    return this.businessService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update business',
    description: 'Update an existing business with new information'
  })
  @ApiParam({ name: 'id', description: 'Business ID' })
  @ApiBody({ type: UpdateBusinessDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Business updated successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Business not found' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - invalid update data' 
  })
  update(@Param('id') id: string, @Body() updateBusinessDto: UpdateBusinessDto) {
    return this.businessService.update(+id, updateBusinessDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete business',
    description: 'Remove a business from the system (soft delete)'
  })
  @ApiParam({ name: 'id', description: 'Business ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Business deleted successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Business not found' 
  })
  remove(@Param('id') id: string) {
    return this.businessService.remove(+id);
  }
}
