import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Smartphone',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Optional description of the product',
    example: 'This is the latest smartphone with advanced features',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 999.99,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'ID of the vendor associated with the product',
    example: '60d21b4967d0d8992e610c85', // Example of MongoDB ObjectId
  })
  @IsMongoId()
  @IsNotEmpty()
  vendor: string;
}
