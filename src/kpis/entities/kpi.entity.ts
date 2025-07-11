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

export enum KpiType {
  REVENUE = 'revenue',
  ATTENDANCE = 'attendance',
  CONVERSION_RATE = 'conversion_rate',
  CUSTOMER_SATISFACTION = 'customer_satisfaction',
  OPERATIONAL_EFFICIENCY = 'operational_efficiency',
  COST_PER_ATTENDEE = 'cost_per_attendee',
  PROFIT_MARGIN = 'profit_margin',
  OTHER = 'other',
}

export enum KpiPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

@Entity()
export class Kpi {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: KpiType,
    default: KpiType.OTHER,
  })
  type: KpiType;

  @Column({
    type: 'enum',
    enum: KpiPeriod,
    default: KpiPeriod.MONTHLY,
  })
  period: KpiPeriod;

  @Column('decimal', { precision: 10, scale: 2 })
  targetValue: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  actualValue: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  percentage: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ nullable: true })
  unit: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Venue, (venue) => venue.kpis)
  venue: Venue;

  @ManyToOne(() => User, { nullable: true })
  createdBy: User;

  @ManyToOne(() => User, { nullable: true })
  responsiblePerson: User;
}
