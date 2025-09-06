import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { UserController } from './controllers/user.controller';
import { CaslModule } from '../casl/casl.module';
import { UserService } from './services/user.service';
import { PermissionController } from './controllers/permission.controller';
import { PermissionService } from './services/permission.service';
import { RoleService } from './services/role.service';
import { Permission } from './entities/permission.entity';
import { RoleController } from './controllers/role.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
    PassportModule,
    CaslModule,
    JwtModule.register({
      signOptions: {expiresIn: '300s'}
    })
  ],
  providers: [AuthService, JwtStrategy, UserService, PermissionService, RoleService],
  controllers: [AuthController, UserController, PermissionController, RoleController],
})
export class AuthModule {}
