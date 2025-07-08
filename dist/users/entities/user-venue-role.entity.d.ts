import { User } from './user.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { Role } from 'src/role/entities/role.entity';
export declare class UserVenueRole {
    id: number;
    user: User;
    venue: Venue;
    role: Role;
}
