const { Storage } = require('@google-cloud/storage')
const GOOGLE_CLOUD_PROJECT_ID = 'pungilandia-gcs';
const GOOGLE_CLOUD_KEYFILE = './pungilandia-gcs-0d178b593aff.json';

const storage = new Storage({
  projectId: GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: GOOGLE_CLOUD_KEYFILE,
});

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

  fastify.get('/search', async (request, reply) => {
    const query = request.query.q;
    const fileName = `${plpDirectory}${plpPrefix}0.json`
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
          const products = JSON.parse(content)
          const regex = new RegExp(query, 'ig')
          const filtered = products.filter(({name}) => regex.test(name))
          reply
            .code(200)
            .type('application/json')
            .header('Content-Type', 'application/json charset=utf-8')
            .send(filtered)
          // replyOk(reply, products.toString())
          // TODO
        })
    } catch (e) {
      replyNotFound(reply)
    }
  })
}

module.exports = routes
