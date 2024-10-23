import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

describe('ProductsController', () => {
  let productsController: ProductsController;

  const mockProduct = {
    _id: '60c72b2f9b1d8e5f9e8e4a3d',
    name: 'Smart Dinamo Iphone',
    description: 'Im just an iphone ><',
    price: 100,
    vendor: '60c72b2f9b1d8e5f9e8e4a3f',
  };

  const productsServiceMock = {
    createProduct: jest.fn((dto) => {
      return {
        _id: Date.now(),
        ...dto,
      };
    }),
    findAllProducts: jest.fn(() => [mockProduct]),
    findProductById: jest.fn((id) => {
      if (id === '60c72b2f9b1d8e5f9e8e4a3d') {
        return mockProduct;
      } else {
        return 'Not found';
      }
    }),
    updateProduct: jest.fn((id, vendorId, dto) => ({
      _id: id,
      ...dto,
    })),
    deleteProduct: jest.fn((id, vendorId) => {
      if (id === '60c72b2f9b1d8e5f9e8e4a3d' && vendorId) {
        return mockProduct;
      } else {
        return 'Not found';
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    })
      .overrideProvider(ProductsService)
      .useValue(productsServiceMock)
      .compile();

    productsController = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(productsController).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Smart Dinamo Iphone',
        description: 'Im just an iphone ><',
        price: 100,
        vendor: '60c72b2f9b1d8e5f9e8e4a3f',
      };
      const result = await productsController.create(createProductDto);
      expect(result).toEqual({
        _id: expect.any(Number),
        ...createProductDto,
      });
      expect(productsServiceMock.createProduct).toHaveBeenCalledWith(
        createProductDto,
      );
    });
  });

  describe('findAllProducts', () => {
    it('should return all products', async () => {
      const result = await productsController.findAll();
      expect(result).toEqual([mockProduct]);
      expect(productsServiceMock.findAllProducts).toHaveBeenCalled();
    });
  });

  describe('findProductById', () => {
    it('should return a product by ID', async () => {
      const result = await productsController.findById(
        '60c72b2f9b1d8e5f9e8e4a3d',
      );
      expect(result).toEqual(mockProduct);
    });

    it('should return not found if product not exist', async () => {
      const result = await productsController.findById('invalid-id');
      expect(result).toBe('Not found');
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 200,
      };
      const result = await productsController.update(
        '60c72b2f9b1d8e5f9e8e4a3d',
        '60c72b2f9b1d8e5f9e8e4a3f',
        updateProductDto,
      );
      expect(result).toEqual({
        _id: '60c72b2f9b1d8e5f9e8e4a3d',
        ...updateProductDto,
      });
      expect(productsServiceMock.updateProduct).toHaveBeenCalledWith(
        '60c72b2f9b1d8e5f9e8e4a3d',
        '60c72b2f9b1d8e5f9e8e4a3f',
        updateProductDto,
      );
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const result = await productsController.delete(
        '60c72b2f9b1d8e5f9e8e4a3d',
        '60c72b2f9b1d8e5f9e8e4a3f',
      );
      expect(result).toEqual(mockProduct);
      expect(productsServiceMock.deleteProduct).toHaveBeenCalledWith(
        '60c72b2f9b1d8e5f9e8e4a3d',
        '60c72b2f9b1d8e5f9e8e4a3f',
      );
    });

    it('should return not found  if product not exist', async () => {
      const result = await productsController.delete(
        'invalid-id',
        '60c72b2f9b1d8e5f9e8e4a3f',
      );
      expect(result).toBe('Not found');
    });
  });
});
