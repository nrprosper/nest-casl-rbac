import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const {email, firstName, lastName, password, roleIds = []} = createUserDto;

    const existingUser = await this.userRepository.findOne({where: {email: email}});
    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    const saltRounds = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let roles: Role[] = [];
    if (roleIds.length > 0) {
      const roles = await this.roleRepository.findBy({id: In(roleIds)})
    } else {
      const defaultRole = await this.roleRepository.findOne({ where: { name: 'user' } });
      if (defaultRole) roles = [defaultRole];
    }

    const user = this.userRepository.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      roles,
    });

    return await this.userRepository.save(user);

  }


  async login(loginDto: LoginDto) {
    const {email, password} = loginDto;

    const user = await this.userRepository.findOne({
      where: {email: email},
      relations: ['roles', 'roles.permissions'],
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user,
      token: this.generateToken(user),
    }

  }


  async validateUser(email: string, password: string): Promise<User | null> {
    const foundUser = await this.userRepository.findOne({
      where: { email, isActive: true },
      relations: ['roles', 'roles.permissions'],
    });

    if (foundUser) {
      const isPasswordValid = await bcrypt.compare(password, foundUser.password);
      if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');
    }

    return foundUser;

  }

  async validateFromToken(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: {email: email},
      relations: ['roles', 'roles.permissions'],
    });
    if (!user) {
      throw new UnauthorizedException('User not valid or not active');
    }
    return user;
  }


  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles?.map(role => role.name) || []
    };
    return this.jwtService.sign(payload);
  }

}
