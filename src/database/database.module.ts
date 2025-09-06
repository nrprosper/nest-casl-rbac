import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionSeeder } from './seeds/permission.seed';
import { RoleSeeder } from './seeds/role.seed';
import { UserSeeder } from './seeds/user.seed';
import { Permission } from '../auth/entities/permission.entity';
import { Role } from '../auth/entities/role.entity';
import { User } from '../auth/entities/user.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission, Role, User]),
  ],
  providers: [PermissionSeeder, RoleSeeder, UserSeeder, SeederService],
})
export class DatabaseModule {}