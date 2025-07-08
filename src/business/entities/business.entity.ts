import { Organization } from 'src/organization/entities/organization.entity';
import { StaffMember } from 'src/staff-member/entities/staff-member.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Business {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Organization, (org) => org.businesses)
  organization: Organization;

  @OneToMany(() => StaffMember, (staff) => staff.business)
  staffMembers: StaffMember[];

  @OneToMany(() => Venue, (venue) => venue.business)
  venues: Venue[];
}
