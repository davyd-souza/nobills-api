// DEPENDENCY
import { type FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '@/database'

// MIDDLEWARE
import { checkSessionIdExists } from '@/middlewares/check-session-id-exists'

export async function transactionsRoute(app: FastifyInstance) {
  // app.get('/', async (req) => {
  app.get('/', { preHandler: [checkSessionIdExists] }, async (req) => {
    const { sessionId } = req.cookies

    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select()

    return { transactions }
  })

  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (req, reply) => {
      const { sessionId } = req.cookies

      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getTransactionParamsSchema.parse(req.params)

      const transaction = await knex('transactions')
        .where({ session_id: sessionId, id })
        .first()

      if (!transaction) {
        return reply.status(401).send({
          error: 'Unauthorized to view transaction.',
        })
      }

      return transaction
    },
  )

  app.post('/', async (req, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['income', 'outcome']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(req.body)

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      })
    }

    await knex('transactions').insert({
      title,
      amount: type === 'income' ? amount : amount * -1,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })

  app.delete(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (req, reply) => {
      const { sessionId } = req.cookies

      const deleteTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = deleteTransactionParamsSchema.parse(req.params)

      const response = await knex('transactions')
        .where({ session_id: sessionId, id })
        .delete()

      if (!response) {
        return reply.status(401).send({
          error: 'Unauthorized to remove transaction.',
        })
      }

      return reply.status(204).send()
    },
  )

  app.get('/summary', { preHandler: [checkSessionIdExists] }, async (req) => {
    const { sessionId } = req.cookies

    const summary = await knex('transactions')
      .where('session_id', sessionId)
      .sum('amount', { as: 'amount' })
      .first()

    return { summary }
  })
}
