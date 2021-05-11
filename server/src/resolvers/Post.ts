import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql'
import { getConnection } from 'typeorm'
import { Post } from '../entities/Post'
import { Updoot } from '../entities/Updoot'
import { User } from '../entities/User'
import { isAuth } from '../middleware/isAuth'
import { MyContext } from '../types'
import makeData from '../utils/makeData'
import { sleep } from '../utils/sleep'

@InputType()
class PostInput {
  @Field()
  title: string

  @Field()
  text: string
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[]
  @Field(() => Boolean)
  hasMore: boolean
}
@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => User)
  creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(post.creatorId)
  }

  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(
    @Root() post: Post,
    @Ctx() { req, updootLoader }: MyContext
  ) {
    if (!req.session.userId) {
      return null
    }
    const updoot = await updootLoader.load({
      postId: post.id,
      userId: req.session.userId,
    })
    return updoot ? updoot.value : null
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg('postId', () => Int) postId: number,
    @Arg('value', () => Int) value: number,

    @Ctx() { req }: MyContext
  ) {
    const isUpdoot = value !== -1

    const realValue = isUpdoot ? 1 : -1
    const { userId } = req.session
    const updoot = await Updoot.findOne({ where: { postId, userId } })

    // changing vote
    if (updoot && updoot.value !== realValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(`
        update updoot
        set value = ${realValue}
        where "postId" = ${postId} and "userId" = ${userId}
        `)

        await tm.query(`
        update post 
        set points = points + ${2 * realValue}
        where id = ${postId}
        `)
      })
    } else if (!updoot) {
      // first vote
      await getConnection().transaction(async (tm) => {
        await tm.query(`
        insert into updoot ("userId", "postId", value)
        values (${userId}, ${postId}, ${realValue});
        
        `)
        await tm.query(`
        update post
        set points = points + ${realValue}
        where id = ${postId};
        `)
      })
    }

    return true
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit)

    const realLimitPlusOne = realLimit + 1
    const replacements: any[] = [realLimitPlusOne]

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)))
    }

    const posts = await getConnection().query(
      `
      select p.*
      from post p

      ${cursor ? `where p."createdAt" < $2` : ''}
      order by p."createdAt" DESC
      limit $1
    
    `,
      replacements
    )

    // console.log('post', posts)
    const returnedPosts = posts.slice(0, realLimit)

    return {
      posts: returnedPosts,
      hasMore: posts.length === realLimitPlusOne,
    }
  }

  @Query(() => Post, { nullable: true })
  post(@Arg('id', () => Int) id: number) {
    return Post.findOne(id)
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Post)
  async createPost(@Arg('input') input: PostInput, @Ctx() { req }: MyContext) {
    console.log(input)
    console.log(req.session.userId)
    await sleep(100)
    return Post.create({ ...input, creatorId: req.session.userId }).save()
  }

  // @UseMiddleware(isAuth)
  // @Mutation(() => Boolean)
  // async deleteAll(@Ctx() { req }: MyContext) {
  //   Post.delete({})
  //   return true
  // }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async createMultiplePost(
    @Arg('postNumber', () => Int) postNumber: number,
    @Ctx() { req }: MyContext
  ) {
    console.log('userId', req.session.userId)

    const postsData = makeData(postNumber)
    for (const postData of postsData) {
      await Post.create({ ...postData, creatorId: req.session.userId }).save()
      await sleep(300)
    }
    return true
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Post)
  async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg('title', () => String, { nullable: true }) title: string,
    @Arg('text', () => String, { nullable: true }) text: string,
    @Ctx() { req }: MyContext
  ) {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ text, title })
      .where('id = :id and "creatorId" = :creatorId', {
        id,
        creatorId: req.session.userId,
      })
      .returning('*')
      .execute()
    console.log('result', result)

    return result.raw[0]
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: MyContext
  ) {
    const post = await Post.findOne(id)
    if (!post) {
      return false
    }
    if (post.creatorId !== req.session.userId) {
      throw new Error('not Authorized')
    }
    await Updoot.delete({ postId: id })
    await Post.delete({ id, creatorId: req.session.userId })
    return true
  }
}
