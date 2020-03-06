require('dotenv').config()
const fastify = require('fastify')({ logger: true })

const buildFastify = async () => {
  fastify.register(require('./products-route'))
  fastify.register(require('fastify-cors'), {
    origin: '*',
  })

  try {
    await fastify.listen(process.env.PORT || 8080)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

buildFastify()

module.exports = buildFastify
