import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { OrganizationUser } from './organizationUser.entity';
import { Company } from 'src/company/entities/company.entity';

@Entity()
export class Organization {
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

  // Una organización puede tener múltiples usuarios
  @OneToMany(
    () => OrganizationUser,
    (organizationUser) => organizationUser.organization,
  )
  organizationUsers: OrganizationUser[];

  // Una organización puede tener múltiples compañías
  @OneToMany(() => Company, (company) => company.organization)
  companies: Company[];
}
