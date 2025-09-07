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
import { AbilitiesGuard } from '../guards/abilities.guard';
import { UserService } from '../services/user.service';
import { Can, CheckAbilities } from '../decorators/abilities.decorator';
import { Action, Subject } from '../entities/permission.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users Controller')
@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AbilitiesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({summary: 'Create a new User'})
  @Post()
  @CheckAbilities(Can(Action.CREATE, Subject.USER))
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({summary: 'Get all users'})
  @Get()
  @CheckAbilities(Can(Action.READ, Subject.USER))
  findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @ApiOperation({summary: 'Get logged in user Profile'})
  @Get('me')
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  @ApiOperation({summary: 'Read one user'})
  @Get(':id')
  @CheckAbilities(Can(Action.READ, Subject.USER))
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({summary: 'Update a User'})
  @Patch(':id')
  @CheckAbilities(Can(Action.UPDATE, Subject.USER))
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiOperation({summary: 'Delete a new User'})
  @Delete(':id')
  @CheckAbilities(Can(Action.DELETE, Subject.USER))
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @ApiOperation({summary: 'Assign a role to a user'})
  @Post(':userId/roles/:roleId')
  @CheckAbilities(Can(Action.UPDATE, Subject.USER))
  assignRole(@Param('userId') userId: string, @Param('roleId') roleId: string) {
    return this.userService.assignRole(userId, roleId);
  }

  @ApiOperation({summary: 'Remove role from a user'})
  @Delete(':userId/roles/:roleId')
  @CheckAbilities(Can(Action.UPDATE, Subject.USER))
  removeRole(@Param('userId') userId: string, @Param('roleId') roleId: string) {
    return this.userService.removeRole(userId, roleId);
  }

}