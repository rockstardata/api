import { Business } from 'src/business/entities/business.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StaffMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Puedes añadir más columnas como email, position, etc.

  @ManyToOne(() => Business, (business) => business.staffMembers)
  business: Business;
}
