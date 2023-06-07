/* eslint-disable */
import dotenv from 'dotenv'
import { Sequelize } from 'sequelize-typescript'
import { Superhero } from '../models/superhero'

dotenv.config()

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env

const URL = `postgres://${PGUSER || ''}:${PGPASSWORD || ''}@${PGHOST || ''}/${PGDATABASE || ''}`

export const dbInit = (): Sequelize => {
  return new Sequelize(URL, {
    models: [Superhero],
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true
      }
    }
  })
}
