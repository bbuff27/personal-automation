const fs = require('fs');
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
    const mutableCategories = categories;
    request.body.forEach(expense => {
      const parentIndex = categories.findIndex(category => category.group === expense.parentCategory);
      const matchingGroup = mutableCategories[parentIndex];
      const childIndex = categories[parentIndex].children.findIndex(category => category.name === expense.childCategory);
      matchingGroup.children[childIndex].expenseTotal += +expense.amount;
    })

    fs.writeFile('./expenses.json', JSON.stringify(mutableCategories), (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });

    return mutableCategories;
  });
}
