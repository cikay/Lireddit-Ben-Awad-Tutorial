import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Field, Int, ObjectType } from 'type-graphql'
import { Post } from './Post'
import { Updoot } from './Updoot'

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column({ unique: true })
  username!: string

  @Field()
  @Column({ unique: true })
  email!: string

  @Field()
  @Column()
  password!: string

  @OneToMany(() => Post, (updoot) => updoot.creator)
  posts: Post[]

  @OneToMany(() => Updoot, (updoot) => updoot.creator)
  updoots: Updoot[]

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date
}
