import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Product } from '../products/product.schema';
import { User } from '../users/user.schema';

@Schema()
class CartItem {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  product: Product;

  @Prop({ default: 1 })
  quantity: number;

  @Prop()
  price: number;
}

@Schema()
export class Cart {
  @Prop({ type: [CartItem] })
  cartItems: CartItem[];

  @Prop()
  totalCartPrice: number;

  @Prop()
  totalPriceAfterDiscount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
