import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionService } from '../services/permission.service';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { AbilitiesGuard } from '../guards/abilities.guard';
import { Can, CheckAbilities } from '../decorators/abilities.decorator';
import { Action, Subject } from '../entities/permission.entity';

@ApiTags('Permissions Controller')
@Controller('permissions')
@UseGuards(JwtAuthGuard, AbilitiesGuard)
export class PermissionController {
  constructor(
    private readonly permissionService: PermissionService,
  ) {}

  @ApiOperation({summary: 'Create a new permission'})
  @Post()
  @CheckAbilities(Can(Action.CREATE, Subject.PERMISSION))
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @ApiOperation({summary: 'Get all permissions'})
  @Get()
  @CheckAbilities(Can(Action.READ, Subject.PERMISSION))
  getAll() {
    return this.permissionService.findAll();
  }

  @ApiOperation({summary: 'Get one permission'})
  @Get(':id')
  @CheckAbilities(Can(Action.READ, Subject.PERMISSION))
  getOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }

  @ApiOperation({summary: 'Update Permission'})
  @Put(':id')
  @CheckAbilities(Can(Action.UPDATE, Subject.PERMISSION))
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @ApiOperation({summary: 'Delete permission'})
  @Delete(':id')
  @CheckAbilities(Can(Action.DELETE, Subject.PERMISSION))
  delete(@Param('id') id: string) {
    return this.permissionService.remove(id);
  }

}