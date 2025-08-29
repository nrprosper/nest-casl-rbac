import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

export enum Action {
  MANAGE = 'manage',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum Subject {
  ALL = 'all',
  USER = 'User',
  ROLE = 'Role',
  PERMISSION = 'Permission',
  BLOG = 'Blog',
}

@Entity("permissions")
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: Action,
    comment: 'The action that can be performed (create, read, update, delete, manage)',
  })
  action: Action;

  @Column({
    type: 'enum',
    enum: Subject,
    comment: 'The subject/resource the action can be performed on'
  })
  subject: Subject;

  @Column({ nullable: true })
  conditions?: string;

  @Column({ nullable: true })
  fields?: string;

  @Column()
  description: string;

  @ManyToMany(() => Role, role => role.permissions)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'permission_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }
  })
  roles: Role[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}