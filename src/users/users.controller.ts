import { Controller, Get, Post, Body, Param, UseGuards, HttpException, HttpStatus, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../decorator/role.decorator';
import { USER_ROLE } from '../common/enum/user-role.enum';
import { AccountService } from '../account/account.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly accountService: AccountService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const accountType = createUserDto.accountType;
    delete createUserDto.accountType;
    const user = await this.usersService.create(createUserDto);
    const account = await this.accountService.create({ accountType: accountType, userId: user.id });
    delete user.password;
    user['account'] = account;
    return user;
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll({});
  }

  @UseGuards(AuthGuard)
  @Roles(USER_ROLE.ACOUNT_HOLDER)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req): Promise<User> {
    if (id !== req.user.id) {
      throw new HttpException('invalid information', HttpStatus.NOT_FOUND);
    }
    return this.usersService.findOne({ where: { id: id } });
  }
}
