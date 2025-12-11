import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { News } from './News';
import { Event } from './Event';

export enum UserRole {
  STUDENT = 'student',
  LECTURER = 'lecturer',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  studentId: string;

  @Column({ nullable: true })
  staffId: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  jambRegNo: string;

  @Column({ nullable: true })
  waecRegNo: string;

  @Column({ nullable: true })
  waecExamDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => News, (news) => news.author)
  news: News[];

  @OneToMany(() => Event, (event) => event.createdBy)
  events: Event[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}



