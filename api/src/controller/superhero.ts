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
      res.sendStatus(400);

      return;
    }

    const foundHero = await heroService.getById(+heroId);

    if (!foundHero) {
      res.sendStatus(404);

      return;
    }

    res.send(foundHero);
  },

  addHero: async (req: Request, res: Response) => {
    const newHero = req.body;

    if (!newHero) {
      res.sendStatus(400);
      return;
    }

    const hero = await heroService.addHero(newHero);

    res.status(201);
    res.send(hero);
  },

  removeHero: async (req: Request, res: Response) => {
    const { heroId } = req.params;

    const foundHero = await heroService.getById(+heroId);

    if (!foundHero) {
      res.sendStatus(404);

      return;
    }

    await heroService.removeHero(+heroId);
    res.sendStatus(204);
  },

  updateHero: async (req: Request, res: Response) => {
    const { heroId } = req.params;
    const newValues = req.body;

    if (!heroId || !newValues) {
      res.sendStatus(400);

      return;
    }
    console.log('controler', newValues);

    const updatedHero = await heroService.updateHero(+heroId, newValues);
    res.send(updatedHero);
  }
}

export default heroController;
