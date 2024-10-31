import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { AddProductToCartDto } from './dtos/add-product.dto';
import { ApiTags, ApiBody, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { MongoIdValidationPipe as isMongoId } from '../customs-pipes/mongo-validation';

@ApiTags('carts')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a cart for user' })
  @ApiBody({ type: AddProductToCartDto })
  @ApiResponse({
    status: 201,
    description: 'Product added to cart successfully.',
  })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async addProductToCart(@Body() addProductToCartDto: AddProductToCartDto) {
    return await this.cartsService.addProductToCart(addProductToCartDto);
  }
  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved user cart successfully.',
  })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getUserCart(@Query('user', isMongoId) user: string) {
    return await this.cartsService.getUserCart(user);
  }

  @Delete(':itemId')
  @ApiOperation({ summary: 'Delete specific item from user cart' })
  @ApiResponse({ status: 200, description: 'Cart item removed successfully.' })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  async removeSpecificCartItem(
    @Query('user', isMongoId) userId: string,
    @Param('itemId', isMongoId) itemId: string,
  ) {
    return await this.cartsService.removeSpecificCartItem(userId, itemId);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete user cart' })
  @ApiResponse({ status: 200, description: 'User cart cleared successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid mongo id format.' })
  @ApiResponse({ status: 404, description: 'Not found exception' })
  async clearUserCart(@Query('user', isMongoId) userId: string) {
    return await this.cartsService.clearUserCart(userId);
  }

  @Put(':itemId')
  @ApiOperation({ summary: 'Update quantity of specific cart item' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quantity: {
          type: 'number',
          description: 'The new quantity for the specific cart item',
          example: 3,
        },
      },
    },
    description:
      'The `quantity` field represents the updated number of units for the given cart item.',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart item quantity updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Cart or item not found.' })
  @ApiResponse({ status: 400, description: 'Invalid mongo id format.' })
  async updateCartItemQuantity(
    @Query('user', isMongoId) userId: string,
    @Param('itemId', isMongoId) itemId: string,
    @Body('quantity') quantity: number,
  ) {
    return await this.cartsService.updateCartItemQuantity(
      userId,
      itemId,
      quantity,
    );
  }
}
