require('dotenv').config()
const fastify = require('fastify')({
  logger: true,
  // http2: true,
  // https: {
  //   key: fs.readFileSync(path.join(__dirname, '..', 'https', 'fastify.key')),
  //   cert: fs.readFileSync(path.join(__dirname, '..', 'https', 'fastify.cert')),
  // },
})

fastify.register(require('./routes/base-route'))
fastify.register(require('./routes/products-route'), { prefix: '/api/v1' })
fastify.register(require('fastify-cors'), {
  origin: '*',
})
fastify.register(require('fastify-helmet'))

const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 8080)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

process.on('SIGINT', async () => {
  fastify.log.info('stopping fastify server')
  await fastify.close()
  fastify.log.info('fastify server stopped')
  process.exit(0)
})

start()

module.exports = fastify
