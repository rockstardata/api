import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { Company } from 'src/company/entities/company.entity';
import { Venue } from 'src/venue/entities/venue.entity';

export enum PermissionLevel {
  ORGANIZATION = 'organization',
  COMPANY = 'company',
  VENUE = 'venue',
}

export enum PermissionType {
  VIEW = 'view',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  ADMIN = 'admin',
}

@Entity()
export class UserPermissionLevel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: PermissionLevel,
  })
  level: PermissionLevel;

  @Column({
    type: 'enum',
    enum: PermissionType,
  })
  permissionType: PermissionType;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Usuario que tiene el permiso
  @ManyToOne(() => User, (user) => user.permissionLevels)
  user: User;

  // Organización (solo si level es ORGANIZATION)
  @ManyToOne(() => Organization, { nullable: true })
  organization: Organization;

  // Compañía (solo si level es COMPANY)
  @ManyToOne(() => Company, { nullable: true })
  company: Company;

  // Local (solo si level es VENUE)
  @ManyToOne(() => Venue, { nullable: true })
  venue: Venue;

  // Usuario que asignó el permiso
  @ManyToOne(() => User, { nullable: true })
  assignedBy: User;
}
