// DEPENDENCY
import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

app.get('/tables', async () => {
  const response = await knex('sqlite_schema').select('*')

  return response
})

try {
  app
    .listen({
      port: 3333,
    })
    .then(() => console.log('HTTP server running'))
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
