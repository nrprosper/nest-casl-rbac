import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { In, Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const { name, permissionIds = [], ...roleData } = createRoleDto;

    const existingRole = await this.roleRepository.findOne({ where: { name } });
    if (existingRole) {
      throw new ConflictException('Role with this name already exists');
    }

    // Get permissions
    const permissions = permissionIds.length > 0
      ? await this.permissionRepository.findBy({id: In(permissionIds)})
      : [];

    const role = this.roleRepository.create({
      ...roleData,
      name,
      permissions,
    });

    return this.roleRepository.save(role);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;

    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permissions');

    if (search) {
      queryBuilder.where('role.name ILIKE :search OR role.description ILIKE :search',
        { search: `%${search}%` });
    }

    const [roles, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      roles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions', 'users'],
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);
    const { permissionIds, ...updateData } = updateRoleDto;

    // Handle permissions update
    if (permissionIds) {
      role.permissions = await this.permissionRepository.findBy({id: In(permissionIds)});
    }

    Object.assign(role, updateData);
    return this.roleRepository.save(role);
  }

  async remove(id: string): Promise<void> {
    const role = await this.findOne(id);

    if (role.users && role.users.length > 0) {
      throw new ConflictException('Cannot delete role that has assigned users');
    }

    await this.roleRepository.remove(role);
  }

  async assignPermission(roleId: string, permissionId: string): Promise<Role> {
    const role = await this.findOne(roleId);
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId }
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    if (!role.permissions.some(p => p.id === permissionId)) {
      role.permissions.push(permission);
      await this.roleRepository.save(role);
    }

    return this.findOne(roleId);
  }

  async removePermission(roleId: string, permissionId: string): Promise<Role> {
    const role = await this.findOne(roleId);
    role.permissions = role.permissions.filter(permission => permission.id !== permissionId);
    await this.roleRepository.save(role);
    return this.findOne(roleId);
  }

}