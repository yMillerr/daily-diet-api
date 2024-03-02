import { it, describe, afterAll, expect, beforeEach, beforeAll } from 'vitest'

import { app } from '../src/app'

import request from 'supertest'
import { execSync } from 'node:child_process'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  // beforeEach(() => {
  //   execSync('pnpm knex migrate:rollback')
  //   execSync('pnpm knex migrate:latest')
  // })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a meals', async () => {
    await request(app.server).post('/users').send({
      name: 'Jhon Doe',
      email: 'jhonDoe@test.com',
      password: '123456',
    })

    const { headers } = await request(app.server)
      .post('/users/login')
      .send({
        email: 'jhonDoe@test.com',
        password: '123456',
      })
      .expect(200)

    const meal = {
      name: 'Test',
      description: 'is a test',
      hour: '12:00',
      date: '2022-12-12',
      category: 'in',
    }

    await request(app.server)
      .post('/meals')
      .set('Cookie', headers['set-cookie'])
      .send(meal)
      .expect(201)
  })
})
