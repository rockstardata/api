import { Venue } from 'src/venue/entities/venue.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum StaffRole {
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
  CASHIER = 'cashier',
  WAITER = 'waiter',
  OTHER = 'other',
}

@Entity()
export class StaffMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  position: string;

  @Column({
    type: 'enum',
    enum: StaffRole,
    default: StaffRole.EMPLOYEE,
  })
  role: StaffRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  hireDate: Date | null;

  @Column({ nullable: true })
  salary: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Venue, (venue) => venue.staffMembers)
  venue: Venue;

  @ManyToOne(() => User, { nullable: true })
  user: User;
}
