import { Controller, Get, Post, Body, Query, UseGuards, Req, Delete, Param, HttpException, HttpStatus } from '@nestjs/common';
import { BeneficiaryService } from './beneficiary.service';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';
import { Beneficiary } from './entities/beneficiary.entity';
import { DeleteResult, FindOptionsWhere } from 'typeorm';
import { DefaultEmptyObjectPipe } from 'src/common/pipes/default-emptyobject.pipe';
import { AuthGuard } from '../auth/auth.guard';
import { AccountService } from 'src/account/account.service';
import { USER_ROLE } from '../common/enum/user-role.enum';
import { Roles } from '../decorator/role.decorator';

@UseGuards(AuthGuard)
@Controller('beneficary')
export class BeneficiaryController {
  constructor(
    private readonly beneficiaryService: BeneficiaryService,
    private readonly accountService: AccountService,
  ) {}

  @Roles(USER_ROLE.ACOUNT_HOLDER)
  @Post()
  async create(@Body() createBeneficiaryDto: CreateBeneficiaryDto, @Req() req): Promise<Beneficiary> {
    if (createBeneficiaryDto.userId === req.user.id) {
      throw new HttpException('You cant add your self as your benificary', HttpStatus.NOT_ACCEPTABLE);
    }
    const isValidUser = await this.accountService.findOne({ where: { userId: createBeneficiaryDto.userId } });
    if (!isValidUser) {
      throw new HttpException('Benificary not found', HttpStatus.BAD_REQUEST);
    }
    const currentUserAccount = await this.accountService.findOne({ where: { userId: req.user.id } });
    const isBenificaryExist = await this.beneficiaryService.findOne({
      where: { accountId: currentUserAccount.id, userId: createBeneficiaryDto.userId },
    });
    if (isBenificaryExist) {
      throw new HttpException('Benificary already exist', HttpStatus.CONFLICT);
    }
    createBeneficiaryDto.accountId = currentUserAccount.id;
    return this.beneficiaryService.create(createBeneficiaryDto);
  }

  @Get()
  async findAll(@Query('where', DefaultEmptyObjectPipe) where: FindOptionsWhere<Beneficiary>, @Req() req): Promise<Beneficiary[]> {
    const currentUserAccount = await this.accountService.findOne({ where: { userId: req.user.id } });
    where.accountId = currentUserAccount.id;
    return this.beneficiaryService.findAll({ where: where });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req): Promise<DeleteResult> {
    const currentUserAccount = await this.accountService.findOne({ where: { userId: req.user.id } });
    const accountId = currentUserAccount.id;
    return this.beneficiaryService.remove({ accountId: accountId, id: id });
  }
}
