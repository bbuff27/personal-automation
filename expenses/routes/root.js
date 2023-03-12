'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    const data = {
      items: ['item 1', 'item 2', 'item 3']
    };
    return reply.view('./templates/viewExpenses.ejs', data);
  })

  fastify.post('/', async function (request, reply) {
    const data = {
      items: ['item 1', 'item 2', 'item 3']
    };
    return reply.view('../templates/viewExpenses.ejs', data);
  });
}
