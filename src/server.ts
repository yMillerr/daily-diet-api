import fastify from "fastify";
import { knex } from './database-config'

const app = fastify()

app.get('/hello', async () => {
  const test = await knex('users').select('*')

  return {
   test
  }
})

app.listen({
  port: 3333
}).then(() => console.log('HTTP server is runing'))