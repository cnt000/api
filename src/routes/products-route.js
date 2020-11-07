const algoliasearch = require('algoliasearch/lite')
const { ReadItem, ReadItems } = require('../db/Read')

const { replyOk, replyNotFound } = require('../replies/reply')

async function routes(fastify) {
  fastify.get('/', async (request, reply) => {
    try {
      const { address, port, family } = fastify.server.address();
      replyOk(reply, {
        message:
          `API for Pungilandia products, visit ${address}:${port} (${family})`,
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

  fastify.get('/total-pages', async (request, reply) => {
    try {
      const snapshot = await ReadItems(0, 1000)
      const products = []
      snapshot.forEach(doc => {
        products.push(1)
      })
      replyOk(reply, products.length)
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
        const client = algoliasearch(
          process.env.ALGOLIA_APP_ID,
          process.env.ALGOLIA_SEARCH_API_KEY
        )
        const index = client.initIndex('products')
        const { hits } = await index.index.search(query, {
          attributesToRetrieve: [
            'name',
            'size',
            'price',
            'image',
            'addToCartLink',
          ],
          hitsPerPage: ppp,
        })
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
