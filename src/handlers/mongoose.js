import mongoose from 'mongoose';
import { colour } from 'printly.js';
import config from './../config.json' assert { type: 'json' };

mongoose
  .connect(config.database.mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(colour.yellowBright('[Database] Connected'));
  })
  .catch((err) => {
    console.log(colour.red('[Database] ⚠️ Unable to connect to MongoDB Database.\nError: ' + err));
  });

export default {
  mongoose: mongoose,
};
