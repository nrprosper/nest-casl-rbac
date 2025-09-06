import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../auth/entities/role.entity';
import {
  Action,
  Permission,
  Subject,
} from '../../auth/entities/permission.entity';

@Injectable()
export class RoleSeeder {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async seed(): Promise<void> {
    const roles = [
      {
        name: 'super_admin',
        description: 'Super Administrator with full system access',
        permissions: [Action.MANAGE, Subject.ALL]
      },
      {
        name: 'admin',
        description: 'Administrator with user and content management',
        permissions: [
          [Action.MANAGE, Subject.USER],
          [Action.MANAGE, Subject.ROLE],
          [Action.READ, Subject.PERMISSION],
          [Action.MANAGE, Subject.BLOG]
        ]
      },
      {
        name: 'moderator',
        description: 'Content moderator',
        permissions: [
          [Action.READ, Subject.USER],
          [Action.READ, Subject.ROLE],
          [Action.MANAGE, Subject.BLOG]
        ]
      },
      {
        name: 'author',
        description: 'Content author',
        permissions: [
          [Action.CREATE, Subject.BLOG],
          [Action.READ, Subject.BLOG],
          [Action.UPDATE, Subject.BLOG],
          [Action.DELETE, Subject.BLOG]
        ]
      },
      {
        name: 'user',
        description: 'Regular user',
        permissions: [
          [Action.READ, Subject.BLOG]
        ]
      }
    ];

    for (const roleData of roles) {
      let existing = await this.roleRepository.findOne({
        where: { name: roleData.name },
        relations: ['permissions']
      });

      if (!existing) {
        existing = this.roleRepository.create({
          name: roleData.name,
          description: roleData.description,
          isActive: true,
        });
      }

      const permissions: Permission[] = [];

      if (roleData.name === 'super_admin') {
        const superAdminPermission = await this.permissionRepository.findOne({
          where: { action: Action.MANAGE, subject: Subject.ALL }
        });
        if (superAdminPermission) {
          permissions.push(superAdminPermission);
        }
      } else {
        for (const [action, subject] of roleData.permissions as [Action, Subject][]) {
          const permission = await this.permissionRepository.findOne({
            where: { action, subject }
          });
          if (permission) {
            permissions.push(permission);
          }
        }
      }

      existing.permissions = permissions;
      await this.roleRepository.save(existing);
    }

    console.log('✅ Roles seeded successfully');
  }
}