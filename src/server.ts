import fastify from "fastify";

const app = fastify()

app.get('/hello', () => {
  return {
    message: 'Ola mundo'
  }
})

app.listen({
  port: 3333
}).then(() => console.log('HTTP server is runing'))