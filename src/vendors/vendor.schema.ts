import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Product } from '../products/product.schema';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Vendor extends Document {
  @ApiProperty({
    description: 'The name of the vendor',
    example: 'Vendor Name',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'The email of the vendor',
    example: 'vendor@example.com',
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({
    description: 'The password for the vendor account',
    example: 'securePassword123',
  })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    description: 'List of product IDs associated with the vendor',
    type: [String],
    example: ['60c72b2f9b1d8e5f9e8e4a3d', '60c72b2f9b1d8e5f9e8e4a3e'],
    required: false,
  })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] })
  products: Product[];
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
