import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Vendor } from '../vendors/vendor.schema';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Product extends Document {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Smartphone',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'The description of the product',
    example: 'Latest model with improved battery life',
    required: false,
  })
  @Prop()
  description?: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 999.99,
    required: true,
  })
  @Prop({ required: true })
  price: number;

  @ApiProperty({
    description: 'The vendor of the product, referencing the Vendor schema',
    type: String,
    example: '60d21b4967d0d8992e610c85',
    required: true,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true })
  vendor: Vendor;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
