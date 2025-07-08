import { Role } from 'src/role/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Organization } from './organization.entity';

@Entity()
@Unique(['user', 'organization']) // Un usuario solo puede tener un rol por organización
export class OrganizationUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.organizationUsers, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(
    () => Organization,
    (organization) => organization.organizationUsers,
    { onDelete: 'CASCADE' },
  )
  organization: Organization;

  @ManyToOne(() => Role, (role) => role.organizationUsers)
  role: Role;
}
