const { ReadItem, ReadItems, ReadItemsAlgolia } = require('../db/Read')

const { replyOk, replyNotFound } = require('../replies/reply')

async function routes(fastify) {
  fastify.get('/', async (request, reply) => {
    try {
      const { address, port, family } = fastify.server.address()
      replyOk(reply, {
        message: `API for Pungilandia products, visit https://${address}:${port}/api/v1/ (${family})`,
      })
    } catch (e) {
      replyNotFound(reply)
    }
  })

  fastify.get('/item/:id(^\\d+$)', async (request, reply) => {
    const product = await ReadItem(request.params.id)
    try {
      replyOk(reply, product)
    } catch (e) {
      replyNotFound(reply)
    }
  })

  fastify.get('/total-products', async (request, reply) => {
    try {
      const query = request.query.q
      let results = [];
      if(query) {
        results = await ReadItemsAlgolia('products', query, 0, 1000)
      } else {
        const snapshot = await ReadItems(0, 1000)
        snapshot.forEach(doc => {
          results.push(1)
        })
      }
      replyOk(reply, results.length)
    } catch (e) {
      replyNotFound(reply)
    }
  })

  fastify.get('/search/:page(^\\d+$)/:ppp(^\\d+$)', async (request, reply) => {
    const query = request.query.q
    const page = Number(request.params.page)
    const ppp = Math.min(Number(request.params.ppp), 48)
    if (query) {
      try {
        const hits = await ReadItemsAlgolia('products', query, page, ppp)
        replyOk(reply, hits)
        return
      } catch (e) {
        console.error({ severity: 'NOTICE', ...e })
        replyNotFound(reply, e)
        return
      }
    }
    try {
      const snapshot = await ReadItems(page, ppp)
      const products = []
      snapshot.forEach(doc => {
        products.push(doc.data())
      })
      replyOk(reply, products)
    } catch (e) {
      replyNotFound(reply)
    }
  })
}

module.exports = routes
