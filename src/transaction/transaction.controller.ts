import { Controller, Get, Post, Body, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { AccountService } from 'src/account/account.service';
import { BeneficiaryService } from 'src/beneficiary/beneficiary.service';
import { AuthGuard } from '../auth/auth.guard';
import { USER_ROLE } from '../common/enum/user-role.enum';
import { Roles } from '../decorator/role.decorator';
import { TRANSACTION_TYPE } from 'src/common/enum/transaction-type.enum';

@UseGuards(AuthGuard)
@Roles(USER_ROLE.ACOUNT_HOLDER)
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly accountService: AccountService,
    private readonly benificaryService: BeneficiaryService,
  ) {}

  //this all should take place inside transaction any query fails all should revert
  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto, @Req() req): Promise<string> {
    //current user account
    const currentUserAccount = await this.accountService.findOne({ where: { userId: req.user.id }, relations: ['user'] });

    // benificiary account
    const benificaryAccount = await this.accountService.findOne({ where: { userId: createTransactionDto.userId }, relations: ['user'] });

    const beneficiary = await this.benificaryService.findOneOrFail({
      where: { userId: createTransactionDto.userId, accountId: currentUserAccount.id },
      relations: ['user'],
    });
    if (beneficiary && currentUserAccount.balance > createTransactionDto.amount) {
      let message = `An amount of ${createTransactionDto.amount} has been credited to your account by ${currentUserAccount.user.userName} with account ${currentUserAccount.id}`;
      //deduct current user balance
      await this.accountService.update(currentUserAccount.id, { balance: currentUserAccount.balance - createTransactionDto.amount });
      //adding money to benificary
      await this.accountService.update(benificaryAccount.id, { balance: benificaryAccount.balance + createTransactionDto.amount });
      await this.transactionService.create({
        type: TRANSACTION_TYPE.CREDIT,
        message: message,
        userId: beneficiary.userId,
        amount: createTransactionDto.amount,
        accountId: currentUserAccount.id,
      });
      message = `An amount of ${createTransactionDto.amount} has been transfer to ${benificaryAccount.user.userName} from your account ${currentUserAccount.id}`;
      await this.transactionService.create({
        type: TRANSACTION_TYPE.TRANSFER,
        message: message,
        userId: currentUserAccount.userId,
        accountId: benificaryAccount.id,
        amount: createTransactionDto.amount,
      });
      return message;
    } else {
      throw new HttpException('You donot have sufficient balance to full fill this transation', HttpStatus.BAD_GATEWAY);
    }
  }

  @Get()
  findAll(@Req() req): Promise<Transaction[]> {
    return this.transactionService.findAll({ where: { userId: req.user.id } });
  }
}
