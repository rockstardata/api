import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { PermissionType } from '../enums/permission-type.enum';
import { ResourceType } from '../enums/resource-type.enum';

@Entity()
@Unique(['user', 'permissionType', 'resourceType', 'resourceId'])
export class UserPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.permissions, { onDelete: 'CASCADE' })
  user: User;

  @Column({
    type: 'enum',
    enum: PermissionType,
  })
  permissionType: PermissionType;

  @Column({
    type: 'enum',
    enum: ResourceType,
  })
  resourceType: ResourceType;

  @Column()
  resourceId: number;
}
