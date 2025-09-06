import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleService } from '../services/role.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { AbilitiesGuard } from '../guards/abilities.guard';
import { Can, CheckAbilities } from '../decorators/abilities.decorator';
import { Action, Subject } from '../entities/permission.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Roles Controller')
@Controller('roles')
@UseGuards(JwtAuthGuard, AbilitiesGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({summary: 'Create a new role'})
  @Post()
  @CheckAbilities(Can(Action.CREATE, Subject.ROLE))
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @ApiOperation({summary: 'Create all roles'})
  @Get()
  @CheckAbilities(Can(Action.CREATE, Subject.ROLE))
  findAll(@Query() paginationDto: PaginationDto) {
    return this.roleService.findAll(paginationDto);
  }

  @ApiOperation({summary: 'Create a role'})
  @Get(':id')
  @CheckAbilities(Can(Action.READ, Subject.ROLE))
  getOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @ApiOperation({summary: 'Update a role'})
  @Patch(':id')
  @CheckAbilities(Can(Action.UPDATE, Subject.ROLE))
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @ApiOperation({summary: 'Delete a role'})
  @Delete(':id')
  @CheckAbilities(Can(Action.DELETE, Subject.ROLE))
  delete(@Param('id') id: string) {
    return this.roleService.remove(id);
  }

}