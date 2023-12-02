// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      password: string
      avatar_url?: string | null
      created_at: string
      session_id?: string
    }
    meals: {
      id: string
      name: string
      category: string
      description?: string | null
      hour: string
      date: string
      created_at: string
      updated_at: string
      user_id: string
    }
  }
}
