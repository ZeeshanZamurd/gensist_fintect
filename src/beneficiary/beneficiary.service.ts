import { Injectable } from '@nestjs/common';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';
import { DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Beneficiary } from './entities/beneficiary.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BeneficiaryService {
  constructor(
    @InjectRepository(Beneficiary)
    private readonly benificaryRepository: Repository<Beneficiary>,
  ) {}
  create(createBeneficiaryDto: CreateBeneficiaryDto): Promise<Beneficiary> {
    return this.benificaryRepository.save(createBeneficiaryDto);
  }

  findAll(options: FindManyOptions<Beneficiary>): Promise<Beneficiary[]> {
    return this.benificaryRepository.find(options);
  }

  findOneOrFail(options: FindOneOptions<Beneficiary>): Promise<Beneficiary> {
    return this.benificaryRepository.findOneOrFail(options);
  }

  findOne(options: FindOneOptions<Beneficiary>): Promise<Beneficiary> {
    return this.benificaryRepository.findOne(options);
  }

  // update(id: number, updateBeneficiaryDto: UpdateBeneficiaryDto) {
  //   return `This action updates a #${id} beneficiary`;
  // }

  remove(options: FindOptionsWhere<Beneficiary>): Promise<DeleteResult> {
    return this.benificaryRepository.softDelete(options);
  }
}
