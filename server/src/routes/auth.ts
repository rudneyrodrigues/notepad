import { z } from 'zod'
import { FastifyInstance } from 'fastify'

import { prisma } from '../lib/prisma'
import { googleApi } from '../lib/google'
import { authenticate } from '../plugins/authenticate'

export const authRouter = async (fastify: FastifyInstance) => {
  fastify.post('/register', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { email, password, name } = createUserSchema.parse(request.body)

    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (user) {
      return reply.status(409).send({
        message: 'User already exists',
      })
    }

    user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    })

    const token = fastify.jwt.sign(
      {
        name,
        email,
      },
      {
        sub: user.id,
        expiresIn: '7 days',
      },
    )

    return reply.status(201).send({
      token,
    })
  })

  fastify.post('/login', async (request, reply) => {
    const loginUserSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { email, password } = loginUserSchema.parse(request.body)

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return reply.status(404).send({
        message: 'User not found',
      })
    }

    const valid = user.password === password

    if (!valid) {
      return reply.status(401).send({
        message: 'Invalid password',
      })
    }

    const token = fastify.jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      {
        sub: user.id,
        expiresIn: '7 days',
      },
    )

    return reply.status(200).send({
      token,
    })
  })

  fastify.post('/google', async (request, reply) => {
    const createUserSchema = z.object({
      accessToken: z.string(),
    })

    const { accessToken } = createUserSchema.parse(request.body)

    const userResponse = googleApi.get('userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const userData = (await userResponse).data

    const userInfoSchema = z.object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      picture: z.string().url(),
    })

    const userInfo = userInfoSchema.parse(userData)

    if (userInfo.name === null || userInfo.email === null) {
      return reply.status(400).send({
        message: 'Invalid user data from Google',
      })
    }

    let user = await prisma.user.findUnique({
      where: {
        email: userInfo.email,
      },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
          googleId: userInfo.id,
        },
      })
    }

    if (user && user?.googleId === null) {
      user = await prisma.user.update({
        where: {
          email: userInfo.email,
        },
        data: {
          googleId: userInfo.id,
        },
      })
    }

    const token = fastify.jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      {
        sub: user.id,
        expiresIn: '7 days',
      },
    )

    return reply.status(200).send({
      token,
    })
  })

  fastify.get('/me', { onRequest: [authenticate] }, async (request, reply) => {
    const userSchema = z.object({
      email: z.string().email(),
    })

    const { email } = userSchema.parse(request.user)

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return reply.status(404).send({
        message: 'User not found',
      })
    }

    return reply.status(200).send({
      user: {
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    })
  })

  fastify.put('/me', { onRequest: [authenticate] }, async (request, reply) => {
    const updateUserSchema = z.object({
      name: z.string(),
    })

    const { name } = updateUserSchema.parse(request.body)

    const userSchema = z.object({
      sub: z.string(),
    })

    const { sub } = userSchema.parse(request.user)

    const user = await prisma.user.update({
      where: {
        id: sub,
      },
      data: {
        name,
      },
    })

    return reply.status(200).send({
      user: {
        name: user.name,
      },
    })
  })
}
