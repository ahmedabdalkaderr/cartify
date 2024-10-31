import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from './carts.service';
import { getModelToken } from '@nestjs/mongoose';
import { Cart } from './cart.schema';
import { NotFoundException } from '@nestjs/common';
import { Product } from '../products/product.schema';

describe('carts service', () => {
  let cartsService: CartsService;
  const mockProduct = { id: 'product_id', price: 100, name: 'iphone' };
  const mockCart = {
    cartItems: [{ id: '1', ...mockProduct }],
    user: 'new_user_id',
    save: jest.fn().mockResolvedValue(true),
  };
  const mockCartModel = {
    create: jest.fn((cart) => {
      cart = mockCart;
      return cart;
    }),
    findOne: jest.fn((obj) => {
      return obj.user === 'new_user_id' ? false : true;
    }),
  };

  const mockProductModel = {
    findById: jest.fn((id) => {
      return id === 'invalid_id' ? false : true;
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartsService,
        {
          provide: getModelToken(Cart.name),
          useValue: mockCartModel,
        },
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();
    cartsService = module.get<CartsService>(CartsService);
  });

  describe('create cart', () => {
    const addProductDto = {
      product: 'invalid_id',
      user: 'new_user_id',
    };
    it('should return a product not found', async () => {
      await expect(
        cartsService.addProductToCart(addProductDto),
      ).rejects.toThrow(
        new NotFoundException(
          `No product exists with this ID: ${addProductDto.product}`,
        ),
      );
    });

    it('should create a new cart for a user', async () => {
      addProductDto.product = 'product_id';
      const result = await cartsService.addProductToCart(addProductDto);
      expect(result).toEqual(mockCart);
    });
  });
});
