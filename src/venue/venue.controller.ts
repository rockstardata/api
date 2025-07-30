import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { VenueService } from './venue.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';

@ApiTags('venue')
@Controller('venue')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new venue',
    description:
      'Create a new venue/location entity with the provided information',
  })
  @ApiBody({ type: CreateVenueDto })
  @ApiResponse({
    status: 201,
    description: 'Venue created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid venue data',
  })
  create(@Body() createVenueDto: CreateVenueDto) {
    return this.venueService.create(createVenueDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all venues',
    description: 'Retrieve a list of all venues/locations in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'List of venues retrieved successfully',
  })
  findAll() {
    return this.venueService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get venue by ID',
    description: 'Retrieve a specific venue by its unique identifier',
  })
  @ApiParam({ name: 'id', description: 'Venue ID' })
  @ApiResponse({
    status: 200,
    description: 'Venue found and retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Venue not found',
  })
  findOne(@Param('id') id: string) {
    return this.venueService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update venue',
    description: 'Update an existing venue with new information',
  })
  @ApiParam({ name: 'id', description: 'Venue ID' })
  @ApiBody({ type: UpdateVenueDto })
  @ApiResponse({
    status: 200,
    description: 'Venue updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Venue not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid update data',
  })
  update(@Param('id') id: string, @Body() updateVenueDto: UpdateVenueDto) {
    return this.venueService.update(+id, updateVenueDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete venue',
    description: 'Remove a venue from the system (soft delete)',
  })
  @ApiParam({ name: 'id', description: 'Venue ID' })
  @ApiResponse({
    status: 200,
    description: 'Venue deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Venue not found',
  })
  remove(@Param('id') id: string) {
    return this.venueService.remove(+id);
  }
}
