import { z } from 'zod'
import { FastifyInstance } from 'fastify'

import { prisma } from '../lib/prisma'
import { authenticate } from '../plugins/authenticate'

export const notesRouter = async (fastify: FastifyInstance) => {
  fastify.post(
    '/notes',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const createNoteSchema = z.object({
        title: z.string(),
        content: z.string(),
      })

      const { title, content } = createNoteSchema.parse(request.body)

      const userSchema = z.object({
        sub: z.string(),
      })

      const { sub } = userSchema.parse(request.user)

      const note = await prisma.note.create({
        data: {
          title,
          content,
          author: {
            connect: {
              id: sub,
            },
          },
        },
      })

      return reply.status(201).send({ note })
    },
  )

  fastify.get(
    '/notes/:id',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const noteSchema = z.object({
        id: z.string(),
      })

      const { id } = noteSchema.parse(request.params)

      const userSchema = z.object({
        sub: z.string(),
      })

      const { sub } = userSchema.parse(request.user)

      const note = await prisma.note.findUnique({
        where: {
          id,
        },
      })

      if (!note) {
        return reply.status(404).send({ message: 'Note not found' })
      }

      if (note.authorId !== sub) {
        return reply.status(403).send({ message: 'Unauthorized' })
      }

      return reply.status(200).send({ note })
    },
  )

  fastify.get(
    '/notes',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const userSchema = z.object({
        sub: z.string(),
      })

      const { sub } = userSchema.parse(request.user)

      const notes = await prisma.note.findMany({
        where: {
          authorId: sub,
          trashed: false,
        },
      })

      if (!notes) {
        return reply.status(404).send({ message: 'Notes not found' })
      }

      // Filter notes that are not archived or in the trash

      const filteredNotes = notes.filter(
        (note) => !note.archived && !note.trashed,
      )

      return reply.status(200).send({ notes: filteredNotes })
    },
  )

  fastify.get(
    '/notes/highlights',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const userSchema = z.object({
        sub: z.string(),
      })

      const { sub } = userSchema.parse(request.user)

      const highlights = await prisma.highlight.findMany({
        where: {
          authorId: sub,
        },
      })

      if (!highlights) {
        return reply.status(404).send({ message: 'Highlights not found' })
      }

      return reply.status(200).send({ highlights })
    },
  )

  fastify.get(
    '/notes/archived',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const userSchema = z.object({
        sub: z.string(),
      })

      const { sub } = userSchema.parse(request.user)

      const notes = await prisma.note.findMany({
        where: {
          authorId: sub,
          archived: true,
          trashed: false,
        },
      })

      if (!notes) {
        return reply.status(404).send({ message: 'Archived notes not found' })
      }

      return reply.status(200).send({ notes })
    },
  )

  fastify.get(
    '/notes/trash',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const userSchema = z.object({
        sub: z.string(),
      })

      const { sub } = userSchema.parse(request.user)

      const notes = await prisma.note.findMany({
        where: {
          authorId: sub,
          trashed: true,
        },
      })

      if (!notes) {
        return reply.status(404).send({ message: 'Trashed notes not found' })
      }

      return reply.status(200).send({ notes })
    },
  )

  fastify.put(
    '/notes/:id',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const updateNoteSchema = z.object({
        title: z.string().optional(),
        content: z.string().optional(),
        highlights: z.array(z.string()).optional(),
        archived: z.boolean().optional(),
        trashed: z.boolean().optional(),
      })

      // Get the title, content, highlights, archived, and trashed from the request body
      const { title, content, highlights, archived, trashed } =
        updateNoteSchema.parse(request.body)

      const noteSchema = z.object({
        id: z.string(),
      })

      // Get the note id from the request params
      const { id } = noteSchema.parse(request.params)

      const userSchema = z.object({
        sub: z.string(),
      })

      // Get the user id from the request user
      const { sub } = userSchema.parse(request.user)

      const note = await prisma.note.findUnique({
        where: {
          id,
        },
      })

      if (!note) {
        return reply.status(404).send({ message: 'Note not found' })
      }

      if (note.authorId !== sub) {
        return reply.status(403).send({ message: 'Unauthorized' })
      }

      const updatedNote = await prisma.note.update({
        where: {
          id,
        },
        data: {
          title,
          content,
          archived,
          trashed,
        },
      })

      if (highlights) {
        const existingHighlights = await prisma.highlight.findMany({
          where: {
            content: {
              in: highlights,
            },
          },
        })

        const newHighlights = highlights.filter(
          (highlight) =>
            !existingHighlights.some(
              (existingHighlight) => existingHighlight.content === highlight,
            ),
        )

        if (newHighlights.length > 0) {
          await prisma.highlight.createMany({
            data: newHighlights.map((highlight) => ({
              content: highlight,
              note: {
                connect: {
                  id,
                },
              },
              authorId: sub,
            })),
          })
        }
      }

      return reply.status(200).send({ note: updatedNote })
    },
  )

  fastify.delete(
    '/notes/:id',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const noteSchema = z.object({
        id: z.string(),
      })

      const { id } = noteSchema.parse(request.params)

      const userSchema = z.object({
        sub: z.string(),
      })

      const { sub } = userSchema.parse(request.user)

      const note = await prisma.note.findUnique({
        where: {
          id,
        },
      })

      if (!note) {
        return reply.status(404).send({ message: 'Note not found' })
      }

      if (note.authorId !== sub) {
        return reply.status(403).send({ message: 'Unauthorized' })
      }

      await prisma.note.delete({
        where: {
          id,
        },
      })

      return reply.status(204).send()
    },
  )
}
