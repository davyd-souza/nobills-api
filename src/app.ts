// DEPENDENCY
import fastify from 'fastify'
import cookie from '@fastify/cookie'

// ROUTE
import { transactionsRoute } from '@/routes/transactions'

export const app = fastify()

app.register(cookie)

app.register(transactionsRoute, { prefix: 'transactions' })
