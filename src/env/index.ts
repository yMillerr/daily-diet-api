import { config } from 'dotenv'

import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({
    path: '.env.test',
  })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.log('Invalid enviroment variables', _env.error.format())

  throw new Error('Invalid enviroment variables')
}
