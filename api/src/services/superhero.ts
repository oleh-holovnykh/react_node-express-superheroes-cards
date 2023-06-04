import { Superhero } from "../models/superhero";

const getAll = () => Superhero.findAll().catch((error) => {
    throw new Error(`Failed to get all heroes: ${error.message}`);
  });

const getById = (heroId: number) => Superhero.findByPk(heroId).catch((error) => {
    throw new Error(`Failed to get hero by ID: ${error.message}`);
  });

const addHero = (newHero: Partial<Superhero>) => Superhero.findOrCreate({
    where: { nickname: newHero.nickname },
    defaults: newHero,
  }).catch((error) => {
    throw new Error(`Failed to add hero: ${error.message}`);
  });

const removeHero = (heroId: number) => Superhero.destroy({
    where: {
      id: heroId,
    },
  }).catch((error) => {
    throw new Error(`Failed to remove hero: ${error.message}`);
  });

const updateHero = (heroId: number, newValues: Partial<Superhero>) => Superhero.update(newValues, {
    where: {
      id: heroId,
    },
  }).catch((error) => {
    throw new Error(`Failed to update hero: ${error.message}`);
  });

export const heroService = {
  getAll,
  getById,
  addHero,
  removeHero,
  updateHero,
};
