import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ACCOUNT_TYPE } from '../common/enum/account-type.enum';
import { v4 as uuidv4 } from 'uuid';
import { USER_ROLE } from '../common/enum/user-role.enum';
describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  const USER_REPOSTITORY_TOKEN = getRepositoryToken(User);
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USER_REPOSTITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            fineOne: jest.fn(),
            findAll: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(USER_REPOSTITORY_TOKEN);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('userRepostiory should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('createUser', () => {
    it('it should create user with encoded password', async () => {
      expect(userRepository).toBeDefined();
      await service.create({
        accountType: ACCOUNT_TYPE.CURRENT,
        email: 'tester@gmail.com',
        password: 'somerandomencodedstring',
        userName: 'tester',
      });
    });
  });

  describe('findAllUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        {
          id: uuidv4(),
          email: 'user1@gmail.com',
          password: 'someencodedstring1',
          userName: 'user1',
          Role: USER_ROLE.ACOUNT_HOLDER,
          hashPassword: jest.fn().mockResolvedValueOnce('dummyHash1'),
          comparePassword: jest.fn(),
        },
        {
          id: uuidv4(),
          email: 'user2@gmail.com',
          password: 'someencodedstring2',
          userName: 'user2',
          Role: USER_ROLE.ACOUNT_HOLDER,
          hashPassword: jest.fn().mockResolvedValueOnce('dummyHash1'),
          comparePassword: jest.fn(),
        },
      ];

      jest.spyOn(userRepository, 'find').mockResolvedValueOnce(mockUsers);
      const allUsers = await service.findAll({});
      expect(allUsers).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return an user', async () => {
      const mockUser = {
        id: uuidv4(),
        email: 'user1@gmail.com',
        password: 'someencodedstring1',
        userName: 'user1',
        Role: USER_ROLE.ACOUNT_HOLDER,
        hashPassword: jest.fn().mockResolvedValueOnce('dummyHash1'),
        comparePassword: jest.fn(),
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);
      const user = await service.findOne({});
      expect(user).toEqual(mockUser);
    });
  });
});
