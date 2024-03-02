import { it, describe, afterAll, expect, beforeEach, beforeAll } from 'vitest'

import { app } from '../src/app'

import request from 'supertest'
import { execSync } from 'node:child_process'

describe('Users routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(() => {
    execSync('pnpm knex migrate:rollback')
    execSync('pnpm knex migrate:latest')
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a user', async () => {
    const { statusCode } = await request(app.server).post('/users').send({
      name: 'Jhon Doe',
      email: 'jhonDoe@test.com',
      password: '123456',
    })

    expect(statusCode).toEqual(201)
  })

  it('should be able to make login', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Jhon Doe',
        email: 'jhonDoe@test.com',
        password: '123456',
      })
      .expect(201)

    const { headers } = await request(app.server)
      .post('/users/login')
      .send({
        email: 'jhonDoe@test.com',
        password: '123456',
      })
      .expect(200)

    expect(headers['set-cookie']).toHaveLength(1)
    expect(headers['set-cookie'][0]).toContain('session_id')
  })
})
