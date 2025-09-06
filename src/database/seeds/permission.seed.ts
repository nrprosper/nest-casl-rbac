import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Action,
  Permission,
  Subject,
} from '../../auth/entities/permission.entity';

@Injectable()
export class PermissionSeeder {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async seed(): Promise<void> {
    const permissions = [
      // User permissions
      { action: Action.MANAGE, subject: Subject.USER, description: 'Full access to user management' },
      { action: Action.CREATE, subject: Subject.USER, description: 'Create new users' },
      { action: Action.READ, subject: Subject.USER, description: 'View users' },
      { action: Action.UPDATE, subject: Subject.USER, description: 'Update users' },
      { action: Action.DELETE, subject: Subject.USER, description: 'Delete users' },

      // Role permissions
      { action: Action.MANAGE, subject: Subject.ROLE, description: 'Full access to role management' },
      { action: Action.CREATE, subject: Subject.ROLE, description: 'Create new roles' },
      { action: Action.READ, subject: Subject.ROLE, description: 'View roles' },
      { action: Action.UPDATE, subject: Subject.ROLE, description: 'Update roles' },
      { action: Action.DELETE, subject: Subject.ROLE, description: 'Delete roles' },

      // Permission permissions
      { action: Action.MANAGE, subject: Subject.PERMISSION, description: 'Full access to permission management' },
      { action: Action.CREATE, subject: Subject.PERMISSION, description: 'Create new permissions' },
      { action: Action.READ, subject: Subject.PERMISSION, description: 'View permissions' },
      { action: Action.UPDATE, subject: Subject.PERMISSION, description: 'Update permissions' },
      { action: Action.DELETE, subject: Subject.PERMISSION, description: 'Delete permissions' },

      // Blog permissions
      { action: Action.MANAGE, subject: Subject.BLOG, description: 'Full access to all blogs' },
      { action: Action.CREATE, subject: Subject.BLOG, description: 'Create new blogs' },
      { action: Action.READ, subject: Subject.BLOG, description: 'Read blogs' },
      {
        action: Action.UPDATE,
        subject: Subject.BLOG,
        description: 'Update own blogs',
        conditions: JSON.stringify({ author: { id: '{{user.id}}' } })
      },
      {
        action: Action.DELETE,
        subject: Subject.BLOG,
        description: 'Delete own blogs',
        conditions: JSON.stringify({ author: { id: '{{user.id}}' } })
      },

      // Global permissions
      { action: Action.MANAGE, subject: Subject.ALL, description: 'Super admin - full system access' },
    ];

    for (const permissionData of permissions) {
      const existing = await this.permissionRepository.findOne({
        where: { action: permissionData.action, subject: permissionData.subject }
      });

      if (!existing) {
        const permission = this.permissionRepository.create(permissionData);
        await this.permissionRepository.save(permission);
      }
    }

    console.log('✅ Permissions seeded successfully');
  }
}