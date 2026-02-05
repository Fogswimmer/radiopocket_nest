import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { Station } from '@/stations/entities/station.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({
    unique: true,
    nullable: true,
    length: 100,
  })
  email?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  lastLogin?: Date;

  @Column({
    nullable: true,
  })
  avatar?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Station, (station) => station.users, {
    cascade: true,
  })
  @JoinTable()
  favoriteStations: Station[];
}
