import fastify from 'fastify'

import { knex } from './database-config'

import { usersRoutes } from './routes/users'

const app = fastify()

app.register(usersRoutes, {
  prefix: '/users',
})

app
  .listen({
    port: 3333,
  })
  .then(() => console.log('HTTP server is runing'))
