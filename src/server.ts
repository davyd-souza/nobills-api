// DEPENDENCY
import fastify from 'fastify'
import { env } from '@/env'
import cookie from '@fastify/cookie'

// ROUTE
import { transactionsRoute } from '@/routes/transactions'

const app = fastify()

app.register(cookie)

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
