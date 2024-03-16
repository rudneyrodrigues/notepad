import Fastify from 'fastify'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'

import { authRouter } from '../src/routes/auth'
import { notesRouter } from '../src/routes/notes'

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  })

  await fastify
    .register(cors, {
      origin: true,
    })
    .register(jwt, {
      secret: String(process.env.SECRET),
    })
    .register(authRouter)
    .register(notesRouter)
    .listen({
      port: process.env.PORT ? Number(process.env.PORT) : 3333,
      host: process.env.HOST ? process.env.HOST : '0.0.0.0',
    })
    .then(() => {
      console.log(`🚀 HTTP server running`)
    })
}

bootstrap()
