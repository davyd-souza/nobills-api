// DEPENDENCY
import fastify from 'fastify'
import { knex } from '@/database'
import { env } from '@/env'

const app = fastify()

app.get('/tables', async () => {
  const response = await knex('sqlite_schema').select('*')

  return response
})

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
