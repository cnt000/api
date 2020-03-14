const { Storage } = require('@google-cloud/storage')
const storage = new Storage()
const bucket = storage.bucket(process.env.BUCKET_NAME)
const { replyOk, replyNotFound } = require('../replies/reply')

const plpPrefix = process.env.PLP_PREFIX || 'page-'
const plpDirectory = process.env.PLP_DIRECORY || 'plp/'
const pdpPrefix = process.env.PDP_PREFIX || 'product-'
const pdpDirectory = process.env.PDP_DIRECORY || 'pdp/'

async function routes(fastify) {
  fastify.get('/item/:id(^\\d+$)', async (request, reply) => {
    const fileName = `${pdpDirectory}${pdpPrefix}${request.params.id}.json`
    const file = bucket.file(fileName)
    let content = ''
    const data = await file.get()
    try {
      data[0]
        .createReadStream()
        .on('error', err => {
          return Promise.reject(err)
        })
        .on('data', data => {
          content += data
        })
        .on('end', () => {
          replyOk(reply, content)
        })
    } catch (e) {
      replyNotFound(reply)
    }
  })

  fastify.get('/search/:page(^\\d+$)', async (request, reply) => {
    const fileName = `${plpDirectory}${plpPrefix}${request.params.page}.json`
    const file = bucket.file(fileName)
    let content = ''
    const data = await file.get()
    try {
      data[0]
        .createReadStream()
        .on('error', err => {
          return Promise.reject(err)
        })
        .on('data', data => {
          content += data
        })
        .on('end', () => {
          replyOk(reply, content)
        })
    } catch (e) {
      replyNotFound(reply)
    }
  })
}

module.exports = routes
