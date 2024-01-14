import { Account } from 'src/account/entities/account.entity';
import { TRANSACTION_TYPE } from 'src/common/enum/transaction-type.enum';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account)
  account: Account;
  @Column()
  accountId: Account['id'];

  @ManyToOne(() => User)
  user: User;
  @Column()
  userId: User['id'];

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: TRANSACTION_TYPE,
  })
  type: TRANSACTION_TYPE;

  @Column()
  message: string;
}
