import { Role } from 'src/role/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { Company } from 'src/company/entities/company.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['user', 'company', 'role'])
export class UserCompanyRole {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userCompanyRoles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Company, (company) => company.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @ManyToOne(() => Role, (role) => role.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: Role;
}
