import { Controller, Get, UseGuards, Req, Patch, Param, Body } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../decorator/role.decorator';
import { USER_ROLE } from '../common/enum/user-role.enum';
import { UpdateAccountDto } from './dto/update-account.dto';

@UseGuards(AuthGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  // @Post()
  // create(@Body() createAccountDto: CreateAccountDto) {
  //   return this.accountService.create(createAccountDto);
  // }

  @Get()
  @Roles(USER_ROLE.ACOUNT_HOLDER)
  findOne(@Req() req): Promise<Account> {
    return this.accountService.findOne({ where: { userId: req.user.id } });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() accountdto: UpdateAccountDto, @Req() req): Promise<{ message: string }> {
    const myAccount = await this.accountService.findOne({ where: { userId: req.user.id, id } });
    const amount = accountdto.balance;
    accountdto.balance = myAccount.balance + accountdto.balance;
    const result = await this.accountService.update(myAccount.id, accountdto);
    if (result.affected > 0) {
      return {
        message: `an amount of ${amount} has been deposited yo your account `,
      };
    }
  }
}
