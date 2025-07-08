import { OrganizationUser } from 'src/organization/entities/organizationUser.entity';
import { UserVenueRole } from 'src/users/entities/user-venue-role.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(
    () => OrganizationUser,
    (organizationUser) => organizationUser.role,
  )
  organizationUsers: OrganizationUser[];

  @OneToMany(() => UserVenueRole, (userVenueRole) => userVenueRole.role)
  userVenueRoles: UserVenueRole[];
}
