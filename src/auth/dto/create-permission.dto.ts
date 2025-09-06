import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Action, Subject } from '../entities/permission.entity';

export class CreatePermissionDto {
  @ApiProperty({
    enum: Action,
    description: 'The action (e.g., manage, create, read, update, delete)',
    example: Action.CREATE,
  })
  @IsEnum(Action)
  action: Action;

  @ApiProperty({
    enum: Subject,
    description: 'The subject/resource this permission applies to',
    example: Subject.USER,
  })
  @IsEnum(Subject)
  subject: Subject;

  @ApiProperty({
    description: 'Human-readable description of this permission',
    example: 'Can create blog posts',
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    type: String,
    description: 'JSON string representing CASL conditions',
    example: '{"userId": {"$eq": "request.user.id"}}',
  })
  @IsOptional()
  @IsString()
  conditions?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'JSON string representing allowed fields',
    example: '["title", "content"]',
  })
  @IsOptional()
  @IsString()
  fields?: string;
}