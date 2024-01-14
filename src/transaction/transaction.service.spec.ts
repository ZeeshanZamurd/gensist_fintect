import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Account } from '../account/entities/account.entity';
import { User } from '../users/entities/user.entity';
import { TRANSACTION_TYPE } from '../common/enum/transaction-type.enum';

describe('transactionSerivce', () => {
  let service: TransactionService;
  let transactionRepository: Repository<Transaction>;
  const TRANSACTION_REPOSTITORY_TOKEN = getRepositoryToken(Transaction);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: TRANSACTION_REPOSTITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            fineOne: jest.fn(),
            findAll: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: TRANSACTION_REPOSTITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            fineOne: jest.fn(),
            findAll: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<TransactionService>(TransactionService);
    transactionRepository = module.get<Repository<Transaction>>(TRANSACTION_REPOSTITORY_TOKEN);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('userRepostiory should be defined', () => {
    expect(transactionRepository).toBeDefined();
  });

  describe('createTransaction', () => {
    it('it should create user with encoded password', async () => {
      expect(transactionRepository).toBeDefined();
      await service.create({
        userId: 'd91a0de5-bee4-4a1f-b3b5-f7709f13d534',
        amount: 10,
      });
    });
  });

  describe('findAllTransactions', () => {
    it('should return an array of transactions', async () => {
      const mockTransactions: Transaction[] = [
        {
          id: uuidv4(),
          account: new Account(),
          accountId: '',
          user: new User(),
          userId: uuidv4(),
          amount: 0,
          type: TRANSACTION_TYPE.CREDIT,
          message: '',
        },
      ];

      jest.spyOn(transactionRepository, 'find').mockResolvedValue(mockTransactions);
      const allTransactions = await service.findAll({});
      expect(allTransactions).toEqual(mockTransactions);
    });
  });
});
