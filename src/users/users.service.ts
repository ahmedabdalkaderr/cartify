import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

@ApiTags('Users')
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 409, description: 'This email is already in use.' })
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const userExist = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (userExist) {
      throw new ConflictException('This email is already in use...');
    }
    const user = await this.userModel.create(createUserDto);
    return await user.save();
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully.' })
  async findAllUsers(): Promise<User[]> {
    const users = await this.userModel.find();
    return users;
  }

  @ApiOperation({ summary: 'Find a user by ID' })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateUser(userId: string, updateData: UpdateUserDto): Promise<User> {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return updatedUser;
  }

  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async deleteUser(userId: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return deletedUser;
  }
}
