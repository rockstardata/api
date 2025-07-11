import { User } from 'src/users/entities/user.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CostCategory {
  RENT = 'rent',
  UTILITIES = 'utilities',
  SALARY = 'salary',
  SUPPLIES = 'supplies',
  MAINTENANCE = 'maintenance',
  MARKETING = 'marketing',
  INSURANCE = 'insurance',
  TAXES = 'taxes',
  OTHER = 'other',
}

export enum CostFrequency {
  ONE_TIME = 'one_time',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

@Entity()
export class Cost {
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
    enum: CostCategory,
    default: CostCategory.OTHER,
  })
  category: CostCategory;

  @Column({
    type: 'enum',
    enum: CostFrequency,
    default: CostFrequency.ONE_TIME,
  })
  frequency: CostFrequency;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'date', nullable: true })
  dueDate: Date | null;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ nullable: true })
  invoiceNumber: string;

  @Column({ nullable: true })
  vendor: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Venue, (venue) => venue.costs)
  venue: Venue;

  @ManyToOne(() => User, { nullable: true })
  createdBy: User;

  @ManyToOne(() => User, { nullable: true })
  approvedBy: User;
}
