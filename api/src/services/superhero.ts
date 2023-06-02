import { Superhero } from "../models/superhero";

export const heroService = {
  getAll: () => {
    return Superhero.findAll().catch((error) => {
      throw new Error(`Failed to get all heroes: ${error.message}`);
    });
  },
  getById: (heroId: number) => {
    return Superhero.findByPk(heroId).catch((error) => {
      throw new Error(`Failed to get hero by id: ${error.message}`);
    })
  },
  addHero: (newHero: Partial<Superhero>) => {
    return Superhero.findOrCreate({
      where: { nickname: newHero.nickname },
      defaults: newHero,
    }).catch((error) => {
      throw new Error(`Failed to add hero: ${error.message}`);
    });
  },
  removeHero: (heroId: number) => {
    return Superhero.destroy({
      where: {
        id: heroId
      }
    }).catch((error) => {
      throw new Error(`Failed to remove hero: ${error.message}`);
    });
  },
  updateHero: (heroId: number, newValues: Partial<Superhero>) => {
    console.log('servise', newValues);

    return Superhero.update(newValues, {
      where: {
        id: heroId
      }
    }).catch((error) => {
      throw new Error(`Failed to update hero: ${error.message}`);
    })
  }
}
