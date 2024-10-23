import { CreateVendorDto } from './create-vendor.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateVendorDto extends PartialType(CreateVendorDto) {}
