import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Product } from './product.schema';
import { Vendor } from '../vendors/vendor.schema';

const mockProducts = [
  { _id: '1', name: 'Product 1', vendor: '1' },
  { _id: '2', name: 'Product 2', vendor: '2' },
];

const mockVendors = [
  { _id: '1', name: 'Vendor 1', products: [] },
  { _id: '2', name: 'Vendor 2', products: [] },
];

describe('ProductsService', () => {
  let service: ProductsService;

  const mockProductModel = {
    findById: jest
      .fn()
      .mockImplementation((id) =>
        Promise.resolve(mockProducts.find((product) => product._id === id)),
      ),

    find: jest.fn().mockResolvedValue(mockProducts),

    findByIdAndUpdate: jest.fn().mockImplementation((id, updateData) => {
      const index = mockProducts.findIndex((product) => product._id === id);
      if (index === -1) return Promise.resolve(null); // Product not found
      mockProducts[index] = { ...mockProducts[index], ...updateData };

      return Promise.resolve(mockProducts[index]); // Return the updated product
    }),

    findByIdAndDelete: jest.fn().mockImplementation((id) => {
      const index = mockProducts.findIndex((product) => product._id === id);
      if (index === -1) return Promise.resolve(null); // Product not found
      const deletedProduct = mockProducts.splice(index, 1); // Remove the product
      return Promise.resolve(deletedProduct[0]); // Return the deleted product
    }),

    create: jest.fn().mockImplementation((dto) => {
      const newProduct = { _id: (mockProducts.length + 1).toString(), ...dto };

      return {
        ...newProduct,
        save: jest.fn().mockImplementation(() => {
          mockProducts.push(newProduct); // Save (persist) the product in the array
          return Promise.resolve(newProduct); // Return the saved product
        }),
      };
    }),
  };

  const mockVendorModel = {
    findById: jest
      .fn()
      .mockImplementation((id) =>
        Promise.resolve(mockVendors.find((vendor) => vendor._id === id)),
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
        {
          provide: getModelToken(Vendor.name),
          useValue: mockVendorModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe('createProduct', () => {
    it("should create a product and add it to the vendor's list", async () => {
      const createProductDto = {
        name: 'OPPO smart phone',
        vendor: '1',
        price: 1000,
      };

      const mockProduct = { _id: '3', ...createProductDto };
      const mockVendor = { ...mockVendors[0], products: [], save: jest.fn() };

      mockProductModel.create.mockResolvedValue(mockProduct);
      mockVendorModel.findById.mockResolvedValue(mockVendor);

      const result = await service.createProduct(createProductDto);

      expect(mockVendorModel.findById).toHaveBeenCalledWith(
        createProductDto.vendor,
      );
      expect(mockProductModel.create).toHaveBeenCalledWith(createProductDto);
      expect(mockVendor.products).toContain(mockProduct);
      expect(mockVendor.save).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });

    it('should throw ConflictException if vendor does not exist', async () => {
      mockVendorModel.findById.mockResolvedValue(null);
      await expect(
        service.createProduct({
          name: 'Product 4',
          vendor: 'invalidVendorId',
          price: 1500,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAllProducts', () => {
    it('should return an array of products with populated vendor data', async () => {
      mockProductModel.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockProducts),
      });

      const result = await service.findAllProducts();

      expect(result).toEqual(mockProducts);
      expect(mockProductModel.find).toHaveBeenCalled();
      expect(mockProductModel.find().populate).toHaveBeenCalledWith('vendor');
    });
  });

  describe('findProductById', () => {
    it('should return a product by ID with populated vendor', async () => {
      // Mock findById method to return an object with populate
      mockProductModel.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockProducts[0]),
      });

      const result = await service.findProductById('1');
      expect(result).toEqual(mockProducts[0]);
      expect(mockProductModel.findById).toHaveBeenCalledWith('1');
      expect(mockProductModel.findById().populate).toHaveBeenCalledWith(
        'vendor',
      );
    });

    it('should throw NotFoundException if product not found', async () => {
      // Mock findById to return null (product not found)
      mockProductModel.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findProductById('999')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockProductModel.findById).toHaveBeenCalledWith('999');
    });
  });
});
