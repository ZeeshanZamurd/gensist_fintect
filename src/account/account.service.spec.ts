import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Account } from '../account/entities/account.entity';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { ACCOUNT_TYPE } from '../common/enum/account-type.enum';
import { UpdateAccountDto } from './dto/update-account.dto';

describe('AccountService', () => {
  let service: AccountService;
  let accountRepository: Repository<Account>;
  const ACCOUNT_REPOSTITORY_TOKEN = getRepositoryToken(Account);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: ACCOUNT_REPOSTITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            fineOne: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneOrFail: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<AccountService>(AccountService);
    accountRepository = module.get<Repository<Account>>(ACCOUNT_REPOSTITORY_TOKEN);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    it('should create an account', async () => {
      const createAccountDto: CreateAccountDto = {
        accountType: ACCOUNT_TYPE.SAVING,
        userId: 'd91a0de5-bee4-4a1f-b3b5-f7709f13d534',
      };

      const mockAccount = new Account();
      mockAccount.id = uuidv4();
      mockAccount.accountType = createAccountDto.accountType;
      mockAccount.userId = createAccountDto.userId;
      mockAccount.balance = 2000; // Default balance

      jest.spyOn(accountRepository, 'create').mockReturnValue(mockAccount);
      jest.spyOn(accountRepository, 'save').mockResolvedValue(mockAccount);

      const result = await service.create(createAccountDto);

      expect(result).toEqual(mockAccount);
      expect(accountRepository.create).toHaveBeenCalledWith(createAccountDto);
      expect(accountRepository.save).toHaveBeenCalledWith(mockAccount);
    });
  });

  describe('findOneAccount', () => {
    it('should find an account', async () => {
      const accountId = uuidv4();
      const mockAccount = new Account();
      mockAccount.id = accountId;
      jest.spyOn(accountRepository, 'findOneOrFail').mockResolvedValue(mockAccount);
      const result = await service.findOne({ where: { id: accountId } });
      expect(result).toEqual(mockAccount);
      expect(accountRepository.findOneOrFail).toHaveBeenCalledWith({ where: { id: accountId } });
    });
  });

  describe('updateAccount', () => {
    it('should update an account', async () => {
      const accountId = uuidv4();
      const updateAccountDto: UpdateAccountDto = {
        balance: 2500,
      };

      const mockUpdateResult = {
        raw: {},
        generatedMaps: [],
        affected: 1,
      };

      jest.spyOn(accountRepository, 'update').mockResolvedValue(mockUpdateResult);
      const result = await service.update(accountId, updateAccountDto);
      expect(result).toEqual(mockUpdateResult);
      expect(accountRepository.update).toHaveBeenCalledWith(accountId, updateAccountDto);
    });
  });
});
