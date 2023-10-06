// DEPENDENCY
import fastify from 'fastify'

const app = fastify()

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
