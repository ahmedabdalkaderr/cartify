import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dtos/create-vendor.dto';
import { UpdateVendorDto } from './dtos/update-vendor.dto';
import { Vendor } from './vendor.schema';
import { MongoIdValidationPipe as isMongoId } from '../customs-pipes/mongo-validation';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('vendors')
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vendor' })
  @ApiResponse({
    status: 201,
    description: 'The vendor has been successfully created.',
    type: Vendor,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createVendorDto: CreateVendorDto): Promise<Vendor> {
    return this.vendorsService.createVendor(createVendorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all vendors' })
  @ApiResponse({
    status: 200,
    description: 'List of all vendors.',
    type: Vendor,
    isArray: true,
  })
  async findAll(): Promise<{ length: number; data: Vendor[] }> {
    const vendors = await this.vendorsService.findAllVendors();
    return { length: vendors.length, data: vendors };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a vendor by ID' })
  @ApiResponse({
    status: 200,
    description: 'The vendor has been successfully retrieved.',
    type: Vendor,
  })
  @ApiResponse({ status: 404, description: 'Vendor not found.' })
  @ApiResponse({ status: 400, description: 'Invalid mongo id format.' })
  async findById(@Param('id', isMongoId) id: string): Promise<Vendor> {
    return this.vendorsService.findVendorById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a vendor by ID' })
  @ApiResponse({
    status: 200,
    description: 'The vendor has been successfully updated.',
    type: Vendor,
  })
  @ApiResponse({ status: 404, description: 'Vendor not found.' })
  @ApiResponse({ status: 400, description: 'Invalid mongo id format.' })
  async update(
    @Param('id', isMongoId) id: string,
    @Body() updateVendorDto: UpdateVendorDto,
  ): Promise<Vendor> {
    return this.vendorsService.updateVendor(id, updateVendorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vendor by ID' })
  @ApiResponse({
    status: 200,
    description: 'The vendor has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Vendor not found.' })
  @ApiResponse({ status: 400, description: 'Invalid mongo id format.' })
  async delete(@Param('id', isMongoId) id: string): Promise<any> {
    return this.vendorsService.deleteVendor(id);
  }
}
