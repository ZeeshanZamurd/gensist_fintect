import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ACCOUNT_TYPE } from '../../common/enum/account-type.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  password: string;

  @IsString()
  @IsOptional()
  id?: string;

  @IsEnum(ACCOUNT_TYPE)
  @IsNotEmpty()
  accountType: ACCOUNT_TYPE;
}
export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
