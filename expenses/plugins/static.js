'use strict'

const path = require('path');

const fp = require('fastify-plugin');

module.exports = fp(async function (fastify, opts) {
  fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, '../public'),
    prefix: '/public/'
  });
})
