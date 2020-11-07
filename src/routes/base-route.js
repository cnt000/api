const { replyOk, replyNotFound } = require('../replies/reply')

async function routes(fastify) {
  fastify.get('/', async (request, reply) => {
    try {
      const { address, port, family } = fastify.server.address();
      replyOk(reply, {
        message:
          `API for Pungilandia products, visit https://${address}:${port}/api/v1/ (${family})`,
      })
    } catch (e) {
      replyNotFound(reply)
    }
  })
}

module.exports = routes
