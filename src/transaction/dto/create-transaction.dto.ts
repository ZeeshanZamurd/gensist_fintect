import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TRANSACTION_TYPE } from 'src/common/enum/transaction-type.enum';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  amount: number;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsEnum(TRANSACTION_TYPE)
  type?: TRANSACTION_TYPE;

  @IsOptional()
  @IsString()
  accountId?: string;
}
