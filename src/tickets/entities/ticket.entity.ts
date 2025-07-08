import { Sale } from 'src/sales/entities/sale.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Venue, (venue) => venue.tickets)
  venue: Venue;

  @OneToMany(() => Sale, (sale) => sale.ticket, { cascade: true })
  sales: Sale[];
}
