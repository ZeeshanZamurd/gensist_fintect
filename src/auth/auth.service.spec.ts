import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../users/dto/create-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { USER_ROLE } from '../common/enum/user-role.enum';
import { v4 as uuidv4 } from 'uuid';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should return LoginResponse on successful sign-in', async () => {
    const loginUserDto: LoginUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: uuidv4(),
      email: 'user1@gmail.com',
      password: 'someencodedstring1',
      userName: 'user1',
      Role: USER_ROLE.ACOUNT_HOLDER,
      hashPassword: jest.fn().mockResolvedValueOnce('dummyHash1'),
      comparePassword: jest.fn().mockResolvedValueOnce(true),
    };

    const mockAccessToken = 'mockAccessToken';

    jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockAccessToken);

    const result = await authService.signIn(loginUserDto);
    expect(result).toEqual({
      id: mockUser.id,
      userName: mockUser.userName,
      role: mockUser.Role,
      email: mockUser.email,
      accessToken: mockAccessToken,
    });

    expect(usersService.findOne).toHaveBeenCalledWith({ where: { email: loginUserDto.email } });
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      id: mockUser.id,
      userName: mockUser.userName,
      role: mockUser.Role,
      email: mockUser.email,
      accessToken: mockAccessToken,
    });
  });

  it('should throw HttpException with "Invalid email or password" message on invalid email or password', async () => {
    const loginUserDto: LoginUserDto = {
      email: 'test@example.com',
      password: 'invalidpassword',
    };

    const mockUser = {
      id: uuidv4(),
      email: 'user1@gmail.com',
      password: 'someencodedstring1',
      userName: 'user1',
      Role: USER_ROLE.ACOUNT_HOLDER,
      hashPassword: jest.fn().mockResolvedValueOnce('dummyHash1'),
      comparePassword: jest.fn().mockResolvedValueOnce(false),
    };
    jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(mockUser, 'comparePassword').mockResolvedValueOnce(false);
    await expect(authService.signIn(loginUserDto)).rejects.toThrowError(new HttpException('Invalid email or password', HttpStatus.NOT_FOUND));
    expect(usersService.findOne).toHaveBeenCalledWith({ where: { email: loginUserDto.email } });
    expect(mockUser.comparePassword).toHaveBeenCalledWith(loginUserDto.password);
  });
});
