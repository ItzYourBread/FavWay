import express from 'express';
import { colour } from 'printly.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.PORT, () => {
  console.log(colour.magentaBright(`[Dashboard] is online and listening to ${process.env.PORT}`));
});
