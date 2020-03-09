'use strict'

const fastify = require('../index')

afterAll(() => {
  fastify.close()
})

test('responds with success on request /', async done => {
  const response = await fastify.inject({
    method: 'GET',
    url: '/',
  })

  expect(response.statusCode).toBe(404)
  done()
})

describe('plp endpoint', () => {
  test('responds with success on request /search/0', async done => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/api/v1/search/0',
    })

    expect(response.statusCode).toBe(200)
    expect(response.payload).toMatch(/Adromischus/)
    done()
  })
})

describe('pdp endpoint', () => {

  test('responds with success on request /item/628', async done => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/api/v1/item/628',
    })

    expect(response.statusCode).toBe(200)
    expect(response.payload).toMatch(/Astrophytum ornatum /)
    done()
  })
})
