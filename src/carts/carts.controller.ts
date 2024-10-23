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
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { MongoIdValidationPipe as isMongoId } from '../customs-pipes/mongo-validation';

@ApiTags('carts')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  @ApiBody({ type: AddProductToCartDto })
  @ApiResponse({
    status: 201,
    description: 'Product added to cart successfully.',
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 400, description: 'Bad ' })
  async addProductToCart(@Body() addProductToCartDto: AddProductToCartDto) {
    return await this.cartsService.addProductToCart(addProductToCartDto);
  }
  @Get()
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
  @ApiResponse({ status: 200, description: 'Cart item removed successfully.' })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  async removeSpecificCartItem(
    @Query('user', isMongoId) userId: string,
    @Param('itemId', isMongoId) itemId: string,
  ) {
    return await this.cartsService.removeSpecificCartItem(userId, itemId);
  }

  @Delete()
  @ApiResponse({ status: 200, description: 'User cart cleared successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid mongo id format.' })
  async clearUserCart(@Query('user', isMongoId) userId: string) {
    return await this.cartsService.clearUserCart(userId);
  }

  @Put(':itemId')
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
