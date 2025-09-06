import {
  MongoAbility,
  AbilityBuilder,
  createMongoAbility
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { Role } from '../auth/entities/role.entity';
import { Permission, Action, Subject } from '../auth/entities/permission.entity';
import { Blog } from '../blog/entities/blog.entity';

type Subjects = typeof User | typeof Role | typeof Permission | typeof Blog | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    if (!user) {
      return build();
    }

    // Process permissions from user's roles
    user.roles?.forEach(role => {
      role.permissions?.forEach(permission => {
        // Properly type the parsed conditions and fields
        let conditions: Record<string, any> | undefined;
        let fields: string[] | undefined;

        if (permission.conditions) {
          try {
            conditions = JSON.parse(permission.conditions) as Record<string, any>;
          } catch {
            conditions = undefined;
          }
        }

        if (permission.fields) {
          try {
            fields = JSON.parse(permission.fields) as string[];
          } catch {
            fields = undefined;
          }
        }

        // Map enum subject to actual subject type
        const subjectType = this.mapSubjectToType(permission.subject);

        if (conditions) {
          if (fields) {
            can(permission.action, subjectType, fields, conditions);
          } else {
            can(permission.action, subjectType, conditions);
          }
        } else {
          if (fields) {
            can(permission.action, subjectType, fields);
          } else {
            can(permission.action, subjectType);
          }
        }
      });
    });

    return build();
  }

  // Helper method to create ability for specific permissions
  createFromPermissions(permissions: Permission[]): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    permissions.forEach(permission => {
      // Properly type the parsed conditions and fields
      let conditions: Record<string, any> | undefined;
      let fields: string[] | undefined;

      if (permission.conditions) {
        try {
          conditions = JSON.parse(permission.conditions) as Record<string, any>;
        } catch {
          conditions = undefined;
        }
      }

      if (permission.fields) {
        try {
          fields = JSON.parse(permission.fields) as string[];
        } catch {
          fields = undefined;
        }
      }

      // Map enum subject to actual subject type
      const subjectType = this.mapSubjectToType(permission.subject);

      if (conditions) {
        if (fields) {
          can(permission.action, subjectType, fields, conditions);
        } else {
          can(permission.action, subjectType, conditions);
        }
      } else {
        if (fields) {
          can(permission.action, subjectType, fields);
        } else {
          can(permission.action, subjectType);
        }
      }
    });

    return build();
  }

  public mapSubjectToType(subject: Subject): Subjects {
    switch (subject) {
      case Subject.USER:
        return User;
      case Subject.ROLE:
        return Role;
      case Subject.PERMISSION:
        return Permission;
      case Subject.BLOG:
        return Blog;
      case Subject.ALL:
        return 'all';
      default:
        return 'all';
    }
  }
}