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

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    PassportModule,
    CaslModule,
    JwtModule.register({
      signOptions: {expiresIn: '300s'}
    })
  ],
  providers: [AuthService, JwtStrategy, UserService],
  controllers: [AuthController, UserController]
})
export class AuthModule {}
