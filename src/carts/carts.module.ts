import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './cart.schema';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { Product, ProductSchema } from '../products/product.schema';
import { User, UserSchema } from '../users/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
