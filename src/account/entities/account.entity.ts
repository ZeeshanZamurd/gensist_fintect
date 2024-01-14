import { ACCOUNT_TYPE } from '../../common/enum/account-type.enum';
import { User } from '../../users/entities/user.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ACCOUNT_TYPE,
  })
  accountType: ACCOUNT_TYPE;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
  @Column()
  userId: User['id'];

  @Column({ default: 2000 })
  balance: number;
}
