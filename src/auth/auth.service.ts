import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from 'src/common/interface/login.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    const user = await this.usersService.findOne({ where: { email: loginUserDto.email } });
    if (user && (await user.comparePassword(loginUserDto.password))) {
      delete user.password;
      const payLoad: LoginResponse = { id: user.id, userName: user.userName, role: user.Role, email: user.email, accessToken: '' };
      const accessToken = await this.jwtService.signAsync(payLoad);
      payLoad.accessToken = accessToken;
      return payLoad;
    } else {
      throw new HttpException('Invalid email or password', HttpStatus.NOT_FOUND);
    }
  }
}
