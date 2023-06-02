import express from "express";
import heroController from "../controller/superhero";

const router = express.Router();

router.get('/', heroController.getAll);
router.post('/', heroController.addHero);
router.get('/:heroId', heroController.getById);
router.delete('/:heroId', heroController.removeHero);
router.patch('/:heroId', heroController.updateHero);

export default router;
