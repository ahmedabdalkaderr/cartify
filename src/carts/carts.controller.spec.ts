import { Test, TestingModule } from '@nestjs/testing';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';

describe.only('CartsController', () => {
  let cartsController: CartsController;

  const mockCart = {
    user: '60c72b2f9b1d8e5f9e8e4a3f',
    cartItems: [
      {
        product: '60c72b2f9b1d8e5f9e8e4a3d',
        quantity: 2,
      },
    ],
  };

  const cartsServiceMock = {
    addProductToCart: jest.fn((dto) => ({
      ...mockCart,
      cartItems: [
        ...mockCart.cartItems,
        { product: dto.product, quantity: dto.quantity },
      ],
    })),
    getUserCart: jest.fn((user) => {
      if (user === '60c72b2f9b1d8e5f9e8e4a3f') {
        return mockCart;
      } else {
        return 'Cart not found';
      }
    }),
    removeSpecificCartItem: jest.fn((userId, itemId) => {
      if (
        userId === '60c72b2f9b1d8e5f9e8e4a3f' &&
        itemId === '60c72b2f9b1d8e5f9e8e4a3d'
      ) {
        return mockCart;
      } else {
        return 'Not found';
      }
    }),
    clearUserCart: jest.fn((userId) => {
      if (userId === '60c72b2f9b1d8e5f9e8e4a3f') {
        return 'Cart cleared';
      } else {
        return 'Not found';
      }
    }),
    updateCartItemQuantity: jest.fn((userId, itemId, quantity) => {
      if (
        userId === '60c72b2f9b1d8e5f9e8e4a3f' &&
        itemId === '60c72b2f9b1d8e5f9e8e4a3d'
      ) {
        return {
          ...mockCart,
          cartItems: [{ product: itemId, quantity }],
        };
      } else {
        return 'Not found';
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartsController],
      providers: [CartsService],
    })
      .overrideProvider(CartsService)
      .useValue(cartsServiceMock)
      .compile();

    cartsController = module.get<CartsController>(CartsController);
  });

  it('should be defined', () => {
    expect(cartsController).toBeDefined();
  });

  describe('addProductToCart', () => {
    it('should add a product to the cart', async () => {
      const addProductToCartDto = {
        product: '60c72b2f9b1d8e5f9e8e4a3d',
        user: '60c72b2f9b1d8e5f9e8e4a3d',
        quantity: 2,
      };
      const result =
        await cartsController.addProductToCart(addProductToCartDto);
      expect(result.cartItems.length).toBeGreaterThan(0);
      expect(cartsServiceMock.addProductToCart).toHaveBeenCalledWith(
        addProductToCartDto,
      );
    });
  });

  describe('getUserCart', () => {
    it("should return the user's cart", async () => {
      const result = await cartsController.getUserCart(
        '60c72b2f9b1d8e5f9e8e4a3f',
      );
      expect(result).toEqual(mockCart);
      expect(cartsServiceMock.getUserCart).toHaveBeenCalledWith(
        '60c72b2f9b1d8e5f9e8e4a3f',
      );
    });
  });

  describe('removeSpecificCartItem', () => {
    it('should remove a specific item from the cart', async () => {
      const result = await cartsController.removeSpecificCartItem(
        '60c72b2f9b1d8e5f9e8e4a3f',
        '60c72b2f9b1d8e5f9e8e4a3d',
      );
      expect(result).toEqual(mockCart);
      expect(cartsServiceMock.removeSpecificCartItem).toHaveBeenCalledWith(
        '60c72b2f9b1d8e5f9e8e4a3f',
        '60c72b2f9b1d8e5f9e8e4a3d',
      );
    });
  });

  describe('clearUserCart', () => {
    it("should clear the user's cart", async () => {
      const result = await cartsController.clearUserCart(
        '60c72b2f9b1d8e5f9e8e4a3f',
      );
      expect(result).toBe('Cart cleared');
      expect(cartsServiceMock.clearUserCart).toHaveBeenCalledWith(
        '60c72b2f9b1d8e5f9e8e4a3f',
      );
    });
  });

  describe('updateCartItemQuantity', () => {
    it('should update the quantity of a specific cart item', async () => {
      const result = await cartsController.updateCartItemQuantity(
        '60c72b2f9b1d8e5f9e8e4a3f',
        '60c72b2f9b1d8e5f9e8e4a3d',
        3,
      );
      expect(result.cartItems[0].quantity).toBe(3);
      expect(cartsServiceMock.updateCartItemQuantity).toHaveBeenCalledWith(
        '60c72b2f9b1d8e5f9e8e4a3f',
        '60c72b2f9b1d8e5f9e8e4a3d',
        3,
      );
    });
  });
});
