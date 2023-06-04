import { Request, Response } from "express";
import { heroService } from "../services/superhero";

const heroController = {
  getAll: async (req: Request, res: Response) => {
    const heroes = await heroService.getAll();

    res.send(heroes);
  },

  getById: async (req: Request, res: Response) => {
    const { heroId } = req.params;

    if (isNaN(+heroId)) {
      res.status(400).send('Invalid hero ID. Please provide a vilid numeric ID.');

      return;
    }

    const foundHero = await heroService.getById(+heroId);

    if (!foundHero) {
      res.status(404).send('Hero doesn\`t exist');

      return;
    }

    res.send(foundHero);
  },

  addHero: async (req: Request, res: Response) => {
    const newHero = req.body;

    if (!newHero) {
      res.status(400).send('Data for the hero is not provided. Please provide the necessary data to create a new hero');
      return;
    }

    const hero = await heroService.addHero(newHero);

    res.status(201).send(hero);
  },

  removeHero: async (req: Request, res: Response) => {
    const { heroId } = req.params;

    const foundHero = await heroService.getById(+heroId);

    if (!foundHero) {
      res.status(404).send('Hero doesn\`t exist');

      return;
    }

    await heroService.removeHero(+heroId);
    res.status(204).send('Hero successfully deleted');
  },

  updateHero: async (req: Request, res: Response) => {
    const { heroId } = req.params;
    const newValues = req.body;

    if (!heroId || !newValues) {
      res.status(400).send('Make sure you have provided the hero identifier and the data for updating.');

      return;
    }

    const updatedHero = await heroService.updateHero(+heroId, newValues);
    res.send(updatedHero);
  }
}

export default heroController;
