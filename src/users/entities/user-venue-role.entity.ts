import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { Role } from 'src/role/entities/role.entity';

@Entity()
export class UserVenueRole {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userVenueRoles)
  user: User;

  @ManyToOne(() => Venue, (venue) => venue.userVenueRoles)
  venue: Venue;

  @ManyToOne(() => Role, (role) => role.userVenueRoles)
  role: Role;
}
