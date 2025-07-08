import { Business } from 'src/business/entities/business.entity';
import { UserVenueRole } from 'src/users/entities/user-venue-role.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
export declare class Venue {
    id: number;
    name: string;
    business: Business;
    userVenueRoles: UserVenueRole[];
    tickets: Ticket[];
}
