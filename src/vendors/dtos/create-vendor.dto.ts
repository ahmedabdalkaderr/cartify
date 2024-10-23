import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVendorDto {
  @ApiProperty({
    description: 'The name of the vendor',
    example: 'Vendor Name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The email of the vendor',
    example: 'vendor@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password for the vendor account',
    example: 'securePassword123',
  })
  @IsNotEmpty()
  password: string;
}
