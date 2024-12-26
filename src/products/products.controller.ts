import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from './product.schema';
import { MongoIdValidationPipe as isMongoId } from '../customs-pipes/mongo-validation';

@ApiTags('Products')
// @UseGuards()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: Product,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return await this.productsService.createProduct(createProductDto);
  }

  @ApiOperation({ summary: 'Retrieve all products' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all products.',
    type: [Product],
  })
  @ApiResponse({ status: 404, description: 'Products not found' })
  @Get()
  async findAll(): Promise<Product[]> {
    return await this.productsService.findAllProducts();
  }

  @ApiOperation({ summary: 'Retrieve a product by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the product', type: String })
  @ApiResponse({
    status: 200,
    description: 'Product found.',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Invalid mongoId format.' })
  @Get(':id')
  async findById(@Param('id', isMongoId) productId: string): Promise<Product> {
    return await this.productsService.findProductById(productId);
  }

  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the product', type: String })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product successfully updated.',
    type: Product,
  })
  @ApiResponse({ status: 400, description: 'Invalid mongoId format.' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiQuery({ name: 'vendor', required: true, description: 'ID of the vendor' })
  @Put(':id')
  async update(
    @Param('id', isMongoId) productId: string,
    @Query('vendor', isMongoId) vendorId: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return await this.productsService.updateProduct(
      productId,
      vendorId,
      updateProductDto,
    );
  }

  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the product', type: String })
  @ApiQuery({ name: 'vendor', required: true, description: 'ID of the vendor' })
  @ApiResponse({
    status: 200,
    description: 'Product successfully deleted.',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Invalid mongoId format.' })
  @Delete(':id')
  async delete(
    @Param('id', isMongoId) productId: string,
    @Query('vendor', isMongoId) vendorId: string,
  ): Promise<Product> {
    return await this.productsService.deleteProduct(productId, vendorId);
  }
}
