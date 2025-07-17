import { User } from 'src/users/entities/user.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { Business } from 'src/business/entities/business.entity';
import { 
  Column, 
  Entity, 
  ManyToOne, 
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  TRANSFER = 'transfer',
  OTHER = 'other',
}

export enum SaleStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productName: string;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CASH,
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'enum',
    enum: SaleStatus,
    default: SaleStatus.COMPLETED,
  })
  status: SaleStatus;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  createdBy: User;

  @ManyToOne(() => Venue)
  venue: Venue;

  @ManyToOne(() => Business, { nullable: true })
  business: Business;
}
