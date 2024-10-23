import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { User } from './user.schema';

const mockUsers = [
  { _id: '1', email: 'user1@gmail.com', password: 'password1' },
  { _id: '2', email: 'user2@gmail.com', password: 'password2' },
  { _id: '3', email: 'user3@gmail.com', password: 'password3' },
];

describe.only('UsersService', () => {
  let service: UsersService;

  const mockUserModel = {
    findOne: jest
      .fn()
      .mockImplementation(({ email }) =>
        Promise.resolve(mockUsers.find((user) => user.email === email)),
      ),

    findById: jest
      .fn()
      .mockImplementation((id) =>
        Promise.resolve(mockUsers.find((user) => user._id === id)),
      ),

    find: jest.fn().mockResolvedValue(mockUsers),

    findByIdAndUpdate: jest.fn().mockImplementation((id, updateData) => {
      const index = mockUsers.findIndex((user) => user._id === id);
      if (index === -1) return Promise.resolve(null);
      mockUsers[index] = { ...mockUsers[index], ...updateData };

      return Promise.resolve(mockUsers[index]);
    }),

    findByIdAndDelete: jest.fn().mockImplementation((id) => {
      const index = mockUsers.findIndex((user) => user._id === id);
      if (index === -1) return Promise.resolve(null); // User not found
      const deletedUser = mockUsers.splice(index, 1); // Remove the user
      return Promise.resolve(deletedUser[0]); // Return the deleted user
    }),

    create: jest.fn().mockImplementation((dto) => {
      const newUser = { _id: (mockUsers.length + 1).toString(), ...dto };

      return {
        ...newUser,
        save: jest.fn().mockImplementation(() => {
          mockUsers.push(newUser); // Save (persist) the user in the array
          return Promise.resolve(newUser); // Return the saved user
        }),
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        name: 'Ahmed',
        email: 'ahmed@gmail.com',
        password: 'pass123',
      };

      const result = await service.createUser(createUserDto);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
      expect(mockUserModel.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({
        ...createUserDto,
        _id: mockUsers.length.toString(),
      });
    });

    it('should throw ConflictException if email is already in use', async () => {
      const createUserDto = {
        name: 'user1',
        email: 'user1@gmail.com',
        password: 'pass123',
      };
      await expect(service.createUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
    });
  });

  describe('findAllUsers', () => {
    it('should return an array of users', async () => {
      const result = await service.findAllUsers();
      expect(result).toEqual(mockUsers);
      expect(mockUserModel.find).toHaveBeenCalled();
    });
  });

  describe('findUserById', () => {
    it('should return a user by ID', async () => {
      const result = await service.findUserById('1');
      expect(result).toEqual(mockUsers[0]);
      expect(mockUserModel.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user not found', async () => {
      await expect(service.findUserById('999')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserModel.findById).toHaveBeenCalledWith('999');
    });
  });

  describe('updateUser', () => {
    const updateUserDto = {
      name: 'User1',
    };

    it('should update a user by ID', async () => {
      const result = await service.updateUser('1', updateUserDto);
      expect(result).toEqual({ ...mockUsers[0], ...updateUserDto });
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        updateUserDto,
        { new: true },
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      await expect(service.updateUser('999', updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '999',
        updateUserDto,
        { new: true },
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      await service.deleteUser('1');
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user not found', async () => {
      await expect(service.deleteUser('999')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('999');
    });
  });
});
