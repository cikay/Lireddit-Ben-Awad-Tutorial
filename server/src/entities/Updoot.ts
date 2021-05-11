import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm'
import { Post } from './Post'
import { User } from './User'

@ObjectType()
@Entity()
export class Updoot extends BaseEntity {
  @Column({ type: 'int' })
  value: number

  @PrimaryColumn()
  userId: number

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.updoots)
  creator: User

  @PrimaryColumn()
  postId: number

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.updoots)
  post: Post

  @ManyToMany(() => Post, (post) => post.updoots)
  createdAt = new Date()
}
