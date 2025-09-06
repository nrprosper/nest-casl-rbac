import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../auth/entities/user.entity';
import { Role } from '../../auth/entities/role.entity';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async seed(): Promise<void> {
    const users = [
      {
        email: 'admin@example.com',
        firstName: 'System',
        lastName: 'Administrator',
        password: await bcrypt.hash('admin123', 12),
        roles: ['super_admin'],
      },
      {
        email: 'moderator@example.com',
        firstName: 'Content',
        lastName: 'Moderator',
        password: await bcrypt.hash('moderator123', 12),
        roles: ['moderator'],
      },
      {
        email: 'author@example.com',
        firstName: 'John',
        lastName: 'Author',
        password: await bcrypt.hash('author123', 12),
        roles: ['author'],
      },
      {
        email: 'user@example.com',
        firstName: 'Jane',
        lastName: 'User',
        password: await bcrypt.hash('user123', 12),
        roles: ['user'],
      },
    ];

    for (const userData of users) {
      let user = await this.userRepository.findOne({
        where: { email: userData.email },
      });

      if (!user) {
        const roles = await this.roleRepository
          .createQueryBuilder('role')
          .where('role.name IN (:...names)', { names: userData.roles })
          .getMany();

        user = this.userRepository.create({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          password: userData.password,
          roles,
        });

        await this.userRepository.save(user);
      }
    }

    console.log('✅ Users seeded successfully');
  }
}