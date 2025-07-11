import { User } from 'src/users/entities/user.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum IncomeCategory {
  TICKET_SALES = 'ticket_sales',
  FOOD_BEVERAGE = 'food_beverage',
  MERCHANDISE = 'merchandise',
  SPONSORSHIP = 'sponsorship',
  ADVERTISING = 'advertising',
  RENTAL = 'rental',
  SERVICES = 'services',
  OTHER = 'other',
}

export enum IncomeStatus {
  PENDING = 'pending',
  RECEIVED = 'received',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

@Entity()
export class Income {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: IncomeCategory,
    default: IncomeCategory.OTHER,
  })
  category: IncomeCategory;

  @Column({
    type: 'enum',
    enum: IncomeStatus,
    default: IncomeStatus.PENDING,
  })
  status: IncomeStatus;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'date', nullable: true })
  dueDate: Date | null;

  @Column({ nullable: true })
  invoiceNumber: string;

  @Column({ nullable: true })
  customer: string;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Venue, (venue) => venue.incomes)
  venue: Venue;

  @ManyToOne(() => Sale, { nullable: true })
  sale: Sale;

  @ManyToOne(() => User, { nullable: true })
  createdBy: User;

  @ManyToOne(() => User, { nullable: true })
  receivedBy: User;
}
