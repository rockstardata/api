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

export enum AgreementStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  TERMINATED = 'terminated',
}

export enum AgreementType {
  VENUE_RENTAL = 'venue_rental',
  SERVICE_PROVIDER = 'service_provider',
  SUPPLIER = 'supplier',
  PARTNERSHIP = 'partnership',
  OTHER = 'other',
}

@Entity()
export class Agreement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: AgreementType,
    default: AgreementType.OTHER,
  })
  type: AgreementType;

  @Column({
    type: 'enum',
    enum: AgreementStatus,
    default: AgreementStatus.DRAFT,
  })
  status: AgreementStatus;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  amount: number;

  @Column({ nullable: true })
  terms: string;

  @Column({ nullable: true })
  contractNumber: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Venue, (venue) => venue.agreements)
  venue: Venue;

  @ManyToOne(() => User, { nullable: true })
  createdBy: User;

  @ManyToOne(() => User, { nullable: true })
  responsiblePerson: User;
}
