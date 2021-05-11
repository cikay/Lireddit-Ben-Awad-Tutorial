import { User } from '../entities/User'
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql'
import { MyContext } from '../types'
import argon2 from 'argon2'
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from '../constants'
import { UsernamePasswordInput } from '../utils/UsernamePasswordInput'
import validateRegister from '../utils/validateRegister'
import { sendEmail } from '../utils/sendEmail'
import { v4 } from 'uuid'

@ObjectType()
class FieldError {
  @Field()
  field: string
  @Field()
  message: string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    if (req.session.userId === user.id) return user.email

    return ''
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { redis, req }: MyContext
  ) {
    if (newPassword.length <= 2) {
      return {
        errors: [
          { field: 'newPassword', message: 'length must be greater than 2' },
        ],
      }
    }
    const key = FORGOT_PASSWORD_PREFIX + token
    const userId = await redis.get(key)
    if (!userId) {
      return {
        errors: [{ field: 'token', message: 'token expired' }],
      }
    }
    const userIdAsNum = parseInt(userId)
    const user = await User.findOne(userIdAsNum)

    if (!user) {
      return {
        errors: [{ field: 'token', message: 'User no longer exists' }],
      }
    }

    await User.update(
      { id: userIdAsNum },
      { password: await argon2.hash(newPassword) }
    )

    await redis.del(key)
    //log ın user after password set
    req.session.userId = user.id
    return { user }
  }

  @Mutation(() => UserResponse)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { redis }: MyContext
  ): Promise<UserResponse | undefined> {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return {
        errors: [{ field: 'email', message: 'Email kayıtlı değil' }],
      }
    }
    const token = v4()
    const body = `<a href='http:localhost:3000/change-password/${token}'>reset password</a>`
    await redis.set(
      FORGOT_PASSWORD_PREFIX + token,
      user.id,
      'ex',
      1000 * 60 * 60 * 24 //one day
    )

    await sendEmail(email, body)
    return
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput
  ): Promise<UserResponse> {
    const errors = validateRegister(options)
    if (errors) return { errors }
    console.log('options', options)

    let user
    try {
      const { username, email, password } = options
      const hashedPassword = await argon2.hash(password)
      user = await User.create({
        username,
        email,
        password: hashedPassword,
      }).save()
    } catch (err) {
      console.log('err', err)
      if (err.detail.includes('email')) {
        return {
          errors: [{ message: 'email taken', field: 'email' }],
        }
      }
      if (err.detail.includes('username')) {
        return {
          errors: [{ message: 'username taken', field: 'username' }],
        }
      }
    }
    return { user }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext
  ) {
    const options = usernameOrEmail.includes('@')
      ? { email: usernameOrEmail }
      : { username: usernameOrEmail }
    const user = await User.findOne({ where: options })

    if (!user) {
      return {
        errors: [
          { field: 'usernameOrEmail', message: 'that username does not exist' },
        ],
      }
    }

    const valid = await argon2.verify(user.password, password)

    if (!valid) {
      return {
        errors: [{ field: 'password', message: 'incorrect password' }],
      }
    }

    req.session.userId = user.id
    console.log('session', req.session)
    return {
      user,
    }
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    if (!req.session.id) {
      return null
    }

    return User.findOne(req.session.userId)
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME)
        if (err) {
          resolve(false)
          return
        }

        resolve(true)
      })
    )
  }
}
