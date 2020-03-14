'use strict'

const fastify = require('../index')
const supertest = require('supertest')

const baseUrl = '/api/v1'
const searchRouteFirstPage = `${baseUrl}/search/0`
const itemRoute628 = `${baseUrl}/item/628`

beforeAll(async () => {
  await fastify.ready()
})

afterAll(() => {
  fastify.close()
})

test('responds with success on request /', async done => {
  const response = await supertest(fastify.server).get('/')

  expect(response.statusCode).toBe(404)
  done()
})

describe('plp endpoint', () => {
  test('responds with success on request /search/0', async done => {
    const response = await supertest(fastify.server).get(searchRouteFirstPage)

    expect(response.statusCode).toBe(200)
    expect(response.body[0].name).toMatch(/Adromischus(.*?)clavifolius/)
    done()
  })
})

describe('pdp endpoint', () => {
  test('responds with success on request /item/628', async done => {
    const response = await supertest(fastify.server).get(itemRoute628)

    expect(response.statusCode).toBe(200)
    expect(response.body.name).toMatch(/Astrophytum ornatum /)
    done()
  })
})

class ReplyMock {
  constructor() {
    this.calls = []
  }
  code() {
    this.calls.push('add')
    return this
  }
  type() {
    this.calls.push('type')
    return this
  }
  header() {
    this.calls.push('header')
    return this
  }
  send() {
    this.calls.push('send')
    return this
  }
}

describe('reply methods', () => {
  test('replyOk', async done => {
    const { replyOk } = require('../replies/reply')
    const rMock = new ReplyMock()
    const expected = [
      expect.stringMatching(/add/),
      expect.stringMatching(/type/),
      expect.stringMatching(/header/),
      expect.stringMatching(/send/),
    ]
    replyOk(rMock, '{}')
    expect(rMock.calls).toEqual(expect.arrayContaining(expected))
    done()
  })
  test('replyNotFound', async done => {
    const { replyNotFound } = require('../replies/reply')
    const rMock = new ReplyMock()
    const expected = [
      expect.stringMatching(/add/),
      expect.stringMatching(/type/),
      expect.stringMatching(/header/),
      expect.stringMatching(/send/),
    ]
    replyNotFound(rMock, '{}')
    expect(rMock.calls).toEqual(expect.arrayContaining(expected))
    done()
  })
})
