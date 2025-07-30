import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from 'src/organization/entities/organization.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { User } from 'src/users/entities/user.entity';
import { Business } from 'src/business/entities/business.entity';

@Entity()
export class Company {
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

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  taxId: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Una compañía pertenece a una organización
  @ManyToOne(() => Organization, (organization) => organization.companies)
  organization: Organization;

  // Una compañía puede tener múltiples locales
  @OneToMany(() => Venue, (venue) => venue.company)
  venues: Venue[];

  // Una compañía puede tener múltiples negocios
  @OneToMany(() => Business, (business) => business.company)
  businesses: Business[];

  // Usuario que creó la compañía
  @ManyToOne(() => User, { nullable: true })
  createdBy: User;
}
