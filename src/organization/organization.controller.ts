import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/role/enums/role.enum';

@ApiTags('organizations')
@ApiBearerAuth()
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Post()
  @ApiOperation({
    summary: 'Create a new organization',
    description: 'Create a new organization entity (Admin and SuperAdmin only)',
  })
  @ApiBody({ type: CreateOrganizationDto })
  @ApiResponse({
    status: 201,
    description: 'Organization created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid organization data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or SuperAdmin role required',
  })
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.create(createOrganizationDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all organizations',
    description: 'Retrieve a list of all organizations in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'List of organizations retrieved successfully',
  })
  findAll() {
    return this.organizationService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get organization by ID',
    description: 'Retrieve a specific organization by its unique identifier',
  })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiResponse({
    status: 200,
    description: 'Organization found and retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.organizationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update organization',
    description: 'Update an existing organization with new information',
  })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiBody({ type: UpdateOrganizationDto })
  @ApiResponse({
    status: 200,
    description: 'Organization updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid update data',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete organization',
    description: 'Remove an organization from the system (soft delete)',
  })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiResponse({
    status: 200,
    description: 'Organization deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.organizationService.remove(id);
  }

  // Nuevo endpoint: solo Admin puede asignar usuarios a organizaciones
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @Post(':orgId/assign-user/:userId')
  @ApiOperation({
    summary: 'Assign user to organization',
    description: 'Assign a user to a specific organization (Admin only)',
  })
  @ApiParam({ name: 'orgId', description: 'Organization ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 201,
    description: 'User assigned to organization successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Organization or user not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin role required',
  })
  assignUserToOrganization(
    @Param('orgId', ParseIntPipe) orgId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.organizationService.assignUserToOrganization(orgId, userId);
  }
}
