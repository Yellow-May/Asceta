import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

export enum NewsStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Entity('news')
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  category: string;

  @Column({
    type: 'enum',
    enum: NewsStatus,
    default: NewsStatus.DRAFT,
  })
  status: NewsStatus;

  @Column({ nullable: true })
  publishDate: Date;

  @ManyToOne(() => User, (user) => user.news)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  authorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}



