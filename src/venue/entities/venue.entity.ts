import { Business } from 'src/business/entities/business.entity';
import { UserVenueRole } from 'src/users/entities/user-venue-role.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Venue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Business, (business) => business.venues)
  business: Business;

  @OneToMany(() => UserVenueRole, (userVenueRole) => userVenueRole.venue)
  userVenueRoles: UserVenueRole[];

  @OneToMany(() => Ticket, (ticket) => ticket.venue)
  tickets: Ticket[];
}
