import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;

  const mockUser = {
    id: '1',
    name: 'Adam',
    email: 'adam@gmail.com',
    password: 'pass123',
  };

  const usersServiceMock = {
    createUser: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),
    findAllUsers: jest.fn(() => [mockUser]),
    findUserById: jest.fn((id) => {
      if (id === '1') {
        return mockUser;
      } else {
        return 'Not found';
      }
    }),
    updateUser: jest.fn((id, dto) => ({
      id,
      ...dto,
    })),
    deleteUser: jest.fn((id) => {
      if (id === '1') {
        return mockUser;
      } else {
        return 'Not found';
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(usersServiceMock)
      .compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        name: 'Adam',
        email: 'adam@gmail.com',
        password: 'pass123',
      };
      const result = await usersController.createUser(createUserDto);
      expect(result).toEqual({
        id: expect.any(Number),
        ...createUserDto,
      });
      expect(usersServiceMock.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findUserById', () => {
    it('should return a user by ID', async () => {
      const result = await usersController.findUserById('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const result = await usersController.findUserById('2');
      expect(result).toBe('Not found');
    });
  });

  describe('findAllUsers', () => {
    it('should return all users', async () => {
      const result = await usersController.findAllUsers();
      expect(result).toEqual({ length: 1, data: [mockUser] });
      expect(usersServiceMock.findAllUsers).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateUserDto = {
        name: 'Adam Updated',
        email: 'adam_updated@gmail.com',
      };
      const result = await usersController.updateUser('1', updateUserDto);
      expect(result).toEqual({
        id: '1',
        ...updateUserDto,
      });
      expect(usersServiceMock.updateUser).toHaveBeenCalledWith(
        '1',
        updateUserDto,
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const result = await usersController.deleteUser('1');
      expect(result).toEqual(mockUser);
      expect(usersServiceMock.deleteUser).toHaveBeenCalledWith('1');
    });

    it('should return not found', async () => {
      const result = await usersController.deleteUser('2');
      expect(result).toBe('Not found');
    });
  });
});
