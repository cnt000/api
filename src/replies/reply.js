const replyOk = (reply, content) =>
  reply
    .code(200)
    .type('application/json')
    .header('Content-Type', 'application/json charset=utf-8')
    .send(content)

const replyNotFound = (reply, error) =>
  reply
    .code(404)
    .type('application/json')
    .header('Content-Type', 'application/json charset=utf-8')
    .send({ message: 'not found', error })

module.exports = {
  replyOk,
  replyNotFound,
}
