// entities/user.entity.ts
import { Entity, OneToMany, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { OrganizationUser } from 'src/organization/entities/organizationUser.entity';
import { UserVenueRole } from './user-venue-role.entity';
import { UserPermission } from 'src/auth/entities/user-permission.entity';
import { UserPermissionLevel } from './user-permission-level.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(
    () => OrganizationUser,
    (organizationUser) => organizationUser.user,
  )
  organizationUsers: OrganizationUser[];

  @OneToMany(() => UserVenueRole, (userVenueRole) => userVenueRole.user)
  userVenueRoles: UserVenueRole[];

  @OneToMany(() => UserPermission, (permission) => permission.user)
  permissions: UserPermission[];

  // Nuevos permisos por nivel jerárquico
  @OneToMany(() => UserPermissionLevel, (permissionLevel) => permissionLevel.user)
  permissionLevels: UserPermissionLevel[];
}
