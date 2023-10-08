// DEPENDENCY
import fastify from 'fastify'
import { env } from '@/env'

// ROUTE
import { transactionsRoute } from './routes/transactions'

const app = fastify()

app.register(transactionsRoute, { prefix: 'transactions' })

try {
  app
    .listen({
      port: env.PORT,
    })
    .then(() => console.log('HTTP server running'))
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
