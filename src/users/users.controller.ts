import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { MongoIdValidationPipe as isMongoId } from '../customs-pipes/mongo-validation';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 409, description: 'Duplicate data.' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all users' })
  @ApiResponse({ status: 200, description: 'A list of all users.' })
  async findAllUsers() {
    const users = await this.usersService.findAllUsers();
    return { length: users.length, data: users };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '60d21b4967d0d8992e610c85',
  })
  @ApiResponse({ status: 200, description: 'The user has been found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 400, description: 'Invalid mongo id format.' })
  async findUserById(@Param('id', isMongoId) userId: string) {
    return await this.usersService.findUserById(userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '60d21b4967d0d8992e610c85',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 400, description: 'Invalid mongo id format.' })
  async updateUser(
    @Param('id', isMongoId) userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(userId, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '60d21b4967d0d8992e610c85',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 400, description: 'Invalid mongo id format.' })
  async deleteUser(@Param('id', isMongoId) userId: string) {
    return await this.usersService.deleteUser(userId);
  }
}
