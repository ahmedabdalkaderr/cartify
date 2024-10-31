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

@Injectable()
export class VendorsService {
  constructor(@InjectModel(Vendor.name) private vendorModel: Model<Vendor>) {}

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

  async findAllVendors(): Promise<Vendor[]> {
    return this.vendorModel.find().populate('products');
  }

  async findVendorById(id: string): Promise<Vendor> {
    const vendor = await this.vendorModel.findById(id).populate('products');
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }
    return vendor;
  }

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

  async deleteVendor(id: string): Promise<any> {
    const result = await this.vendorModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }
    return result;
  }
}
