require('dotenv').config()
const fastify = require('fastify')({ logger: true })

fastify.register(require('./products-route'))

fastify.register(require('fastify-cors'), {
  origin: '*'
})

const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 8080)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
