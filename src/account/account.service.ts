import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { FindOneOptions, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}
  create(createAccountDto: CreateAccountDto): Promise<Account> {
    return this.accountRepository.save(this.accountRepository.create(createAccountDto));
  }

  findAll() {
    return `This action returns all account`;
  }

  findOne(options: FindOneOptions<Account>): Promise<Account> {
    return this.accountRepository.findOneOrFail(options);
  }

  update(id: string, updateAccountDto: UpdateAccountDto): Promise<UpdateResult> {
    return this.accountRepository.update(id, updateAccountDto);
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
