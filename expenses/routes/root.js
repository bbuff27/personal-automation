const parseCsv = require('../util/parseCsv');
const categories = require('../util/expenseCategories');

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    const parsedExpenses = await parseCsv();
    const data = {
      categories,
      parsedExpenses,
    }
    return reply.view('./templates/viewExpenses.ejs', data);
  })

  fastify.post('/', async function (request, reply) {
    const data = {
      expenses: request.body,
    }
    return reply.view('../templates/viewCategorizedExpenses.ejs', data);
  });
}
