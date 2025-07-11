import { Company } from 'src/company/entities/company.entity';
import { UserVenueRole } from 'src/users/entities/user-venue-role.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { Cost } from 'src/costs/entities/cost.entity';
import { Income } from 'src/income/entities/income.entity';
import { Kpi } from 'src/kpis/entities/kpi.entity';
import { Agreement } from 'src/agreements/entities/agreement.entity';
import { StaffMember } from 'src/staff-member/entities/staff-member.entity';
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

  // Un local puede tener múltiples tickets
  @OneToMany(() => Ticket, (ticket) => ticket.venue)
  tickets: Ticket[];

  // Un local puede tener múltiples ventas
  @OneToMany(() => Sale, (sale) => sale.venue)
  sales: Sale[];

  // Un local puede tener múltiples costos
  @OneToMany(() => Cost, (cost) => cost.venue)
  costs: Cost[];

  // Un local puede tener múltiples ingresos
  @OneToMany(() => Income, (income) => income.venue)
  incomes: Income[];

  // Un local puede tener múltiples KPIs
  @OneToMany(() => Kpi, (kpi) => kpi.venue)
  kpis: Kpi[];

  // Un local puede tener múltiples acuerdos
  @OneToMany(() => Agreement, (agreement) => agreement.venue)
  agreements: Agreement[];

  // Un local puede tener múltiples miembros del staff
  @OneToMany(() => StaffMember, (staffMember) => staffMember.venue)
  staffMembers: StaffMember[];
}
