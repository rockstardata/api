import { Company } from 'src/company/entities/company.entity';
import { UserVenueRole } from 'src/users/entities/user-venue-role.entity';
import { Agreement } from 'src/agreements/entities/agreement.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Venue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Un local pertenece a una compañía
  @ManyToOne(() => Company, (company) => company.venues)
  company: Company;

  // Un local puede tener múltiples usuarios con roles
  @OneToMany(() => UserVenueRole, (userVenueRole) => userVenueRole.venue)
  userVenueRoles: UserVenueRole[];

  // Un local puede tener múltiples acuerdos
  @OneToMany(() => Agreement, (agreement) => agreement.venue)
  agreements: Agreement[];
}
