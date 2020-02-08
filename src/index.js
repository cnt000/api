const fastify = require('fastify')({ logger: true });
const fetch = require('node-fetch');

fastify.get('/item/:id(^\\d+)', async request => {
  const data = await require(`../data/pdp/product-${request.params.id}.json`);
  return data;
});

fastify.get('/search/:page(^\\d+)', async request => {
  const data = await require(`../data/plp/page-${request.params.page}.json`);
  return data;
});

fastify.get('/test/:id(^\\d+)', async request => {
  const data = await fetch(`https://jsonplaceholder.typicode.com/todos/${request.params.id}`);
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
