import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor } from './vendor.schema';
import { CreateVendorDto } from './dtos/create-vendor.dto';
import { UpdateVendorDto } from './dtos/update-vendor.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('vendors')
@Injectable()
export class VendorsService {
  constructor(@InjectModel(Vendor.name) private vendorModel: Model<Vendor>) {}

  @ApiOperation({ summary: 'Create a new vendor' })
  @ApiResponse({
    status: 201,
    description: 'The vendor has been successfully created.',
    type: Vendor,
  })
  @ApiResponse({
    status: 409,
    description: 'This email is already in use.',
  })
  async createVendor(createVendorDto: CreateVendorDto): Promise<Vendor> {
    const vendorExist = await this.vendorModel.findOne({
      email: createVendorDto.email,
    });
    if (vendorExist) {
      throw new ConflictException('This email is already in use');
    }
    const vendor = await this.vendorModel.create(createVendorDto);
    return vendor;
  }

  @ApiOperation({ summary: 'Retrieve all vendors' })
  @ApiResponse({
    status: 200,
    description: 'List of vendors.',
    type: [Vendor],
  })
  async findAllVendors(): Promise<Vendor[]> {
    return this.vendorModel.find().populate('products');
  }
  s;

  @ApiOperation({ summary: 'Retrieve a vendor by ID' })
  @ApiResponse({
    status: 200,
    description: 'The found vendor.',
    type: Vendor,
  })
  @ApiResponse({
    status: 404,
    description: 'Vendor with ID not found.',
  })
  async findVendorById(id: string): Promise<Vendor> {
    const vendor = await this.vendorModel.findById(id).populate('products');
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }
    return vendor;
  }

  @ApiOperation({ summary: 'Update a vendor by ID' })
  @ApiResponse({
    status: 200,
    description: 'The updated vendor.',
    type: Vendor,
  })
  @ApiResponse({
    status: 404,
    description: 'Vendor with ID not found.',
  })
  async updateVendor(
    id: string,
    updateVendorDto: UpdateVendorDto,
  ): Promise<Vendor> {
    const updatedVendor = await this.vendorModel
      .findByIdAndUpdate(id, updateVendorDto, { new: true })
      .populate('products');
    if (!updatedVendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }
    return updatedVendor;
  }

  @ApiOperation({ summary: 'Delete a vendor by ID' })
  @ApiResponse({
    status: 200,
    description: 'The deleted vendor.',
  })
  @ApiResponse({
    status: 404,
    description: 'Vendor with ID not found.',
  })
  async deleteVendor(id: string): Promise<any> {
    const result = await this.vendorModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }
    return result;
  }
}
