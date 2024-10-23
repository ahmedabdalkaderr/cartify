import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.schema';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Vendor } from '../vendors/vendor.schema';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Products Service')
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Vendor.name) private vendorModel: Model<Vendor>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  @ApiOperation({ summary: 'Check if the vendor is the owner of a product' })
  @ApiResponse({
    status: 200,
    description: 'Vendor is the owner of the product',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: You are not the vendor of this product',
  })
  async isVendor(productId: string, vendorId: string): Promise<boolean> {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException(
        `Product with this id: ${productId} not found`,
      );
    }
    if (product.vendor.toString() !== vendorId) {
      throw new ConflictException('You are not the vendor of this product');
    }
    return true;
  }

  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: Product,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: No vendor exists with this ID',
  })
  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const vendor = await this.vendorModel.findById(createProductDto.vendor);
    if (!vendor) {
      throw new ConflictException(
        `No vendor exists with this ID: ${createProductDto.vendor}`,
      );
    }
    const product = await this.productModel.create(createProductDto);
    vendor.products.push(product);
    await vendor.save();
    return product;
  }

  @ApiOperation({ summary: 'Retrieve all products' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all products.',
    type: [Product],
  })
  async findAllProducts(): Promise<Product[]> {
    return this.productModel.find().populate('vendor');
  }

  @ApiOperation({ summary: 'Find a product by its ID' })
  @ApiResponse({
    status: 200,
    description: 'Product found',
    type: Product,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async findProductById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).populate('vendor');
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({
    status: 200,
    description: 'Product successfully updated',
    type: Product,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: You are not the vendor of this product',
  })
  async updateProduct(
    productId: string,
    vendorId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.isVendor(productId, vendorId);
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(productId, updateProductDto, { new: true })
      .populate('vendor');
    return updatedProduct;
  }

  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({
    status: 200,
    description: 'Product successfully deleted',
    type: Product,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: You are not the vendor of this product',
  })
  async deleteProduct(productId: string, vendorId: string): Promise<Product> {
    await this.isVendor(productId, vendorId);
    const deletedProduct = await this.productModel.findByIdAndDelete(productId);
    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    return deletedProduct;
  }
}
