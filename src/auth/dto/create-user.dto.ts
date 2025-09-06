import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User’s email address',
    example: 'prosper.rk1@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'mine123@#',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User’s first name',
    example: 'Prosper',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'User’s last name',
    example: 'Nishimwe',
  })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({
    type: String,
    description: 'URL to user’s avatar image',
    example: 'https://gravatar.com/prosperrk1',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'List of role UUIDs to assign to the user',
    example: ['c3a8b1e0-8f9d-4c3b-9a1f-7c5d3e2b1a0f'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  roleIds?: string[];
}