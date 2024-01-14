import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBeneficiaryDto {
  //this user id is actually id of benificary to whom money can be sent
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsString()
  accountId?: string;
}
