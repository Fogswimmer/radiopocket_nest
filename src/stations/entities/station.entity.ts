import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { User } from '@/users/entities/user.entity';

@Entity()
export class Station {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  slug: string;

  @Column({ length: 255 })
  name: string;

  @Column()
  streamUrl: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ length: 255, nullable: true })
  genre?: string;

  @Column({ length: 255, nullable: true })
  location?: string;

  @Column({ nullable: true })
  logo?: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 0 })
  listenersCount: number;

  @ManyToMany(() => User, (user) => user.favoriteStations)
  @JoinTable()
  users: User[];
}
