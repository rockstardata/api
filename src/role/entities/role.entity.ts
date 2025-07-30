import { OrganizationUser } from 'src/organization/entities/organizationUser.entity';
import { UserVenueRole } from 'src/users/entities/user-venue-role.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => OrganizationUser,
    (organizationUser) => organizationUser.role,
  )
  organizationUsers: OrganizationUser[];

  @OneToMany(() => UserVenueRole, (userVenueRole) => userVenueRole.role)
  userVenueRoles: UserVenueRole[];
}
