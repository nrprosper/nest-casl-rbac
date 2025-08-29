import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from './role.entity';
import { Blog } from '../../blog/entities/blog.entity';

@Entity("users")
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  avatar?: string;

  @ManyToMany(() => Role, role => role.users, {eager: true})
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }
  })
  roles: Role[];

  @OneToMany(() => Blog, blog => blog.author)
  blogs: Blog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Helper method to get all permissions
  get permissions(): string[] {
    return this.roles?.flatMap(role => role.permissions.map(p => p.action)) || [];
  }

  // Helper method to check if user has specific role
  hasRole(roleName: string): boolean {
    return this.roles?.some(role => role.name === roleName) || false;
  }

}