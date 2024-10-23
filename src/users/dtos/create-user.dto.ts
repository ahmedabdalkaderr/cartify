import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    required: true,
    example: 'Adam',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    required: true,
    example: 'adam@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    required: true,
    example: 'P@ssw0rd123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'The role of the user (optional)',
    default: 'customer',
    example: 'admin',
  })
  @IsString()
  @IsOptional()
  role?: string;
}
