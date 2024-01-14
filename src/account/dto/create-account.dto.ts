import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ACCOUNT_TYPE } from '../../common/enum/account-type.enum';

export class CreateAccountDto {
  @IsEnum(ACCOUNT_TYPE)
  @IsOptional()
  accountType: ACCOUNT_TYPE;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsNumber()
  balance?: number;
}
