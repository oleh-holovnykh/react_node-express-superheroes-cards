import { Superhero } from '../models/superhero'

// const getAll = async () => await Superhero.findAll().catch((error: Error) => {
//   throw new Error(`Failed to get all heroes: ${error.message}`)
// })

const getAll = async (): Promise<Superhero[]> => {
  return await Superhero.findAll().catch((error: Error) => {
    throw new Error(`Failed to get all heroes: ${error.message}`)
  })
}
// const getById = async (heroId: number) => await Superhero.findByPk(heroId).catch((error: Error) => {
//   throw new Error(`Failed to get hero by ID: ${error.message}`)
// })

const getById = async (heroId: number): Promise<Superhero | null> => {
  return await Superhero.findByPk(heroId).catch((error: Error) => {
    throw new Error(`Failed to get hero by ID: ${error.message}`)
  })
}

// const addHero = async (newHero: Partial<Superhero>) => await Superhero.findOrCreate({
//   where: { nickname: newHero.nickname },
//   defaults: newHero
// }).catch((error: Error) => {
//   throw new Error(`Failed to add hero: ${error.message}`)
// })

const addHero = async (newHero: Partial<Superhero>): Promise<[Superhero, boolean]> => {
  return await Superhero.findOrCreate({
    where: { nickname: newHero.nickname },
    defaults: newHero
  }).catch((error: Error) => {
    throw new Error(`Failed to add hero: ${error.message}`)
  })
}

// const removeHero = async (heroId: number) => await Superhero.destroy({
//   where: {
//     id: heroId
//   }
// }).catch((error: Error) => {
//   throw new Error(`Failed to remove hero: ${error.message}`)
// })

const removeHero = async (heroId: number): Promise<number> => {
  return await Superhero.destroy({
    where: {
      id: heroId
    }
  }).catch((error: Error) => {
    throw new Error(`Failed to remove hero: ${error.message}`)
  })
}
// const updateHero = async (heroId: number, newValues: Partial<Superhero>) => await Superhero.update(newValues, {
//   where: {
//     id: heroId
//   }
// }).catch((error: Error) => {
//   throw new Error(`Failed to update hero: ${error.message}`)
// })
const updateHero = async (heroId: number, newValues: Partial<Superhero>): Promise<number> => {
  const [affectedCount] = await Superhero.update(newValues, {
    where: {
      id: heroId
    }
  }).catch((error: Error) => {
    throw new Error(`Failed to update hero: ${error.message}`)
  })

  return affectedCount
}

export const heroService = {
  getAll,
  getById,
  addHero,
  removeHero,
  updateHero
}
