import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Unique name for the role',
    example: 'Admin',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the role’s purpose',
    example: 'Administrator with full access',
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Whether the role is currently active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    type: [String],
    description: 'List of permission UUIDs assigned to this role',
    example: ['550e8400-e29b-41d4-a716-446655440000'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds?: string[];
}