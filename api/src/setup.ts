/* eslint-disable */
import { Superhero } from './models/superhero'
import { dbInit } from './utils/initDB';

(async () => {
  dbInit()

  await Superhero.sync({ alter: true }).catch((error: Error) => {
    throw new Error(`Can't sync database: ${error.message}`)
  })
})()
