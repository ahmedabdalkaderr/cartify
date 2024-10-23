import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddProductToCartDto {
  @ApiProperty({
    description: 'The ID of the product to be added to the cart',
    example: '60c72b2f5f1b2c001f4e8d2a',
  })
  @IsNotEmpty()
  @IsString()
  product: string;

  @ApiProperty({
    description: 'The ID of the user who owns the cart',
    example: '60c72b2f5f1b2c001f4e8d2b',
  })
  @IsNotEmpty()
  @IsMongoId()
  user: string;
}
