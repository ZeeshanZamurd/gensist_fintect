import { Account } from 'src/account/entities/account.entity';
import { baseEntity } from 'src/common/baseEntity';
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
