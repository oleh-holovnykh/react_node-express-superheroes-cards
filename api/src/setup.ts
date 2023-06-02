import { Superhero } from "./models/superhero";
import { dbInit } from "./utils/initDB";

(async () => {
  dbInit();

  await Superhero.sync({ alter: true });

  console.log('synced!');
})()
