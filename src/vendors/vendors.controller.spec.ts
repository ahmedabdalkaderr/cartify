import { Test, TestingModule } from '@nestjs/testing';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';

describe('VendorController', () => {
  let vendorController: VendorsController;

  const mockVendor = {
    id: '1',
    name: 'Sieve',
    email: 'Sieve@gmail.com',
    password: 'pass123',
  };

  const vendorServiceMock = {
    createVendor: jest.fn((dto) => ({
      id: Date.now(),
      ...dto,
    })),
    findAllVendors: jest.fn(() => [mockVendor]),
    findVendorById: jest.fn((id) => (id === '1' ? mockVendor : 'Not found')),
    updateVendor: jest.fn((id, dto) => ({
      id,
      ...dto,
    })),
    deleteVendor: jest.fn((id) => (id === '1' ? mockVendor : 'Not found')),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendorsController],
      providers: [VendorsService],
    })
      .overrideProvider(VendorsService)
      .useValue(vendorServiceMock)
      .compile();

    vendorController = module.get<VendorsController>(VendorsController);
  });

  it('should be defined', () => {
    expect(vendorController).toBeDefined();
  });

  describe('createVendor', () => {
    it('should create a new vendor', async () => {
      const createVendorDto = {
        name: 'Sieve brother',
        email: 'sieve-brother@gmail.com',
        password: 'pass123',
      };
      const result = await vendorController.create(createVendorDto);
      expect(result).toEqual({
        id: expect.any(Number),
        ...createVendorDto,
      });
      expect(vendorServiceMock.createVendor).toHaveBeenCalledWith(
        createVendorDto,
      );
    });
  });

  describe('findVendorById', () => {
    it('should return a vendor by ID', async () => {
      const result = await vendorController.findById('1');
      expect(result).toEqual(mockVendor);
    });

    it('should return "Not found" if vendor does not exist', async () => {
      const result = await vendorController.findById('2');
      expect(result).toBe('Not found');
    });
  });

  describe('findAllVendors', () => {
    it('should return all vendors', async () => {
      const result = await vendorController.findAll();
      expect(result).toEqual({ length: 1, data: [mockVendor] });
      expect(vendorServiceMock.findAllVendors).toHaveBeenCalled();
    });
  });

  describe('updateVendor', () => {
    it('should update a vendor', async () => {
      const updateVendorDto = {
        name: 'Mr. sieve',
      };
      const result = await vendorController.update('1', updateVendorDto);
      expect(result).toEqual({
        id: '1',
        ...updateVendorDto,
      });
      expect(vendorServiceMock.updateVendor).toHaveBeenCalledWith(
        '1',
        updateVendorDto,
      );
    });
  });

  describe('deleteVendor', () => {
    it('should delete a vendor', async () => {
      const result = await vendorController.delete('1');
      expect(result).toEqual(mockVendor);
      expect(vendorServiceMock.deleteVendor).toHaveBeenCalledWith('1');
    });

    it('should return "Not found" if vendor does not exist', async () => {
      const result = await vendorController.delete('2');
      expect(result).toBe('Not found');
    });
  });
});
