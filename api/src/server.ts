import express from 'express';
import { dbInit } from "./utils/initDB";
import { default as heroRouter } from "./routes/superhero";
import cors from 'cors';

const app = express();

dbInit();

app
  .use(cors())
  .use('/heroes', express.json(), heroRouter)
  .listen(5500);
