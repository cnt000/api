require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const fetch = require('node-fetch');

const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const bucket = storage.bucket('pungilandia-items');

const plpPrefix = process.env.PLP_PREFIX || 'page-';
const plpDirectory = process.env.PLP_DIRECORY || 'plp/';
const pdpPrefix = process.env.PDP_PREFIX || 'product-';
const pdpDirectory = process.env.PDP_DIRECORY || 'pdp/';

fastify.get('/item/:id(^\\d+$)', async (request, reply) => {
  const fileName = `${pdpDirectory}${pdpPrefix}${request.params.id}.json`;
  const file = bucket.file(fileName);
  let content = '';
  file
    .get()
    .then(data => {
      data[0]
        .createReadStream()
        .on('error', err => {
          return Promise.reject(err);
        })
        .on('data', data => {
          content += data;
        })
        .on('end', () => {
          reply
            .code(200)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send(content);
        });
    })
    .catch(() =>
      reply
        .code(404)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({ message: 'not found' }),
    );
});

fastify.get('/search/:page(^\\d+$)', async (request, reply) => {
  const fileName = `${plpDirectory}${plpPrefix}${request.params.page}.json`;
  const file = bucket.file(fileName);
  let content = '';
  file
    .get()
    .then(data => {
      data[0]
        .createReadStream()
        .on('error', err => {
          return Promise.reject(err);
        })
        .on('data', data => {
          content += data;
        })
        .on('end', () => {
          reply
            .code(200)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send(content);
        });
    })
    .catch(() =>
      reply
        .code(404)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({ message: 'not found' }),
    );
});

const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 3000);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
