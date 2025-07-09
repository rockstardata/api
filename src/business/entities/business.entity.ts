import { Organization } from 'src/organization/entities/organization.entity';
import { StaffMember } from 'src/staff-member/entities/staff-member.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Business {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  taxId: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Organization, (org) => org.businesses)
  organization: Organization;

  @ManyToOne(() => User, { nullable: true })
  createdBy: User;

  @OneToMany(() => StaffMember, (staff) => staff.business)
  staffMembers: StaffMember[];

  @OneToMany(() => Venue, (venue) => venue.business)
  venues: Venue[];
}
