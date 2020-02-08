require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const fetch = require('node-fetch');

const cdnBaseUrl = process.env.CDN_BASE_URL || './data/';
const plpPrefix = process.env.PLP_PREFIX || 'page-';
const plpDirectory = process.env.PLP_DIRECORY || 'plp/';
const pdpPrefix = process.env.PDP_PREFIX || 'product-';
const pdpDirectory = process.env.PDP_DIRECORY || 'pdp/';

fastify.get('/item/:id(^\\d+)', async request => {
  const data = await fetch(
    `${cdnBaseUrl}${pdpDirectory}${pdpPrefix}${request.params.id}.json`,
  );
  return data.json();
});

fastify.get('/search/:page(^\\d+)', async request => {
  const data = await fetch(
    `${cdnBaseUrl}${plpDirectory}${plpPrefix}${request.params.page}.json`,
  );
  return data.json();
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
