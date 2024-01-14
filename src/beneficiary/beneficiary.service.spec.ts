import { Test, TestingModule } from '@nestjs/testing';
import { BeneficiaryService } from './beneficiary.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Beneficiary } from './entities/beneficiary.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Account } from '../account/entities/account.entity';

describe('BeneficiaryService', () => {
  let service: BeneficiaryService;
  let beneficiaryRepository: Repository<Beneficiary>;
  const BENEFICIARY_REPOSITORY_TOKEN = getRepositoryToken(Beneficiary);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BeneficiaryService,
        {
          provide: BENEFICIARY_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            findOneOrFail: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BeneficiaryService>(BeneficiaryService);
    beneficiaryRepository = module.get<Repository<Beneficiary>>(BENEFICIARY_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('beneficiaryRepository should be defined', () => {
    expect(beneficiaryRepository).toBeDefined();
  });

  // describe('create', () => {
  //   it('should create a beneficiary', async () => {
  //     const createBeneficiaryDto: CreateBeneficiaryDto = {
  //       userId: uuidv4(),
  //       accountId: uuidv4(),
  //     };

  //     const mockBeneficiary = new Beneficiary();
  //     mockBeneficiary.userId = uuidv4();
  //     mockBeneficiary.accountId = uuidv4();

  //     jest.spyOn(beneficiaryRepository, 'create').mockReturnValue(mockBeneficiary);
  //     jest.spyOn(beneficiaryRepository, 'save').mockResolvedValue(mockBeneficiary);
  //     const result = await service.create(createBeneficiaryDto);
  //     expect(result).toEqual(mockBeneficiary);
  //     expect(beneficiaryRepository.create).toHaveBeenCalledWith(createBeneficiaryDto);
  //     expect(beneficiaryRepository.save).toHaveBeenCalledWith(mockBeneficiary);
  //   });
  // });

  describe('findAll', () => {
    it('should return an array of beneficiaries', async () => {
      const mockBeneficiaries: Beneficiary[] = [
        {
          id: 'beneficiary1',
          userId: 'user1',
          accountId: 'account1',
          user: new User()!,
          account: new Account!(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(beneficiaryRepository, 'find').mockResolvedValue(mockBeneficiaries);
      const allBeneficiaries = await service.findAll({});

      expect(allBeneficiaries).toEqual(mockBeneficiaries);
    });
  });

  describe('findOneOrFail', () => {
    it('should return a beneficiary', async () => {
      const beneficiaryId = 'beneficiary123';
      const mockBeneficiary = new Beneficiary();
      mockBeneficiary.id = beneficiaryId;

      jest.spyOn(beneficiaryRepository, 'findOneOrFail').mockResolvedValue(mockBeneficiary);
      const result = await service.findOneOrFail({ where: { id: beneficiaryId } });

      expect(result).toEqual(mockBeneficiary);
      expect(beneficiaryRepository.findOneOrFail).toHaveBeenCalledWith({ where: { id: beneficiaryId } });
    });
  });

  describe('findOne', () => {
    it('should return a beneficiary', async () => {
      const beneficiaryId = 'beneficiary123';
      const mockBeneficiary = new Beneficiary();
      mockBeneficiary.id = beneficiaryId;

      jest.spyOn(beneficiaryRepository, 'findOne').mockResolvedValue(mockBeneficiary);
      const result = await service.findOne({ where: { id: beneficiaryId } });

      expect(result).toEqual(mockBeneficiary);
      expect(beneficiaryRepository.findOne).toHaveBeenCalledWith({ where: { id: beneficiaryId } });
    });
  });
});
