import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import cookie from '@fastify/cookie'

const app = fastify()

app.register(cookie)

app.register(usersRoutes, {
  prefix: '/users',
})

app
  .listen({
    port: 3333,
  })
  .then(() => console.log('HTTP server is runing'))
