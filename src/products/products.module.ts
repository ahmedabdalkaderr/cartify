import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from './product.schema';
import { VendorsService } from 'src/vendors/vendors.service';
import { Vendor, VendorSchema } from 'src/vendors/vendor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Vendor.name, schema: VendorSchema }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, VendorsService],
})
export class ProductsModule {}
