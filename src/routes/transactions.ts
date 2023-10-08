// DEPENDENCY
import { type FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '@/database'

export async function transactionsRoute(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions').select('*')

    return transactions
  })

  app.post('/', async (req, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['income', 'outcome']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(req.body)

    await knex('transaction').insert({
      title,
      amount: type === 'income' ? amount : amount * -1,
    })

    return reply.status(201).send()
  })
}