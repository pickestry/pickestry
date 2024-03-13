// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import { get } from 'lodash-es'
import path from 'node:path'

const server = Fastify({})

server.get('/planets', { logLevel: 'warn' }, (request, reply) => {
  const { offset = 0, limit = 10 } = request.query

  const page = Math.round(offset / limit)

  server.register(fastifyStatic, {
    root: path.join(import.meta.dirname, 'vendor'),
    prefix: '/static/'
  })

  fetch(`https://exoplanets.nasa.gov/api/v1/planets/?order=display_name asc&per_page=${10}&page=${page}&search=`)
  .then((res) => res.json())
  .then((data) => {
    reply.send({
      data: get(data, 'items', []),
      limit,
      offset
    })
  })

})

server.listen({ port: 3124 }, (err, address) => {

  console.log(`server listening on ${address}`) // eslint-disable-line no-console

  if (err) {
    server.log.error(err)
    process.exit(1)
  }
})
