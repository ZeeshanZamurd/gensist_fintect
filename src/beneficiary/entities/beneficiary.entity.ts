import { Account } from '../../account/entities/account.entity';
import { baseEntity } from '../../common/baseEntity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Beneficiary extends baseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
  @Column()
  userId: User['id'];

  //current user bankaccount to whome these benificaries belong
  @ManyToOne(() => Account)
  account: Account;
  @Column()
  accountId: Account['id'];
}
