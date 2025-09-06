import { Injectable } from '@nestjs/common';
import { PermissionSeeder } from './seeds/permission.seed';
import { RoleSeeder } from './seeds/role.seed';
import { UserSeeder } from './seeds/user.seed';

@Injectable()
export class SeederService {
  constructor(
    private permissionSeeder: PermissionSeeder,
    private roleSeeder: RoleSeeder,
    private userSeeder: UserSeeder,
  ) {}

  async seedAll(): Promise<void> {
    console.log('Starting database seeding...');

    await this.permissionSeeder.seed();
    await this.roleSeeder.seed();
    await this.userSeeder.seed();

    console.log('Database seeding completed!');
  }

}