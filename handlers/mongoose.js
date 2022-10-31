import mongoose from 'mongoose';
import config from "./../config.json" assert {type: 'json'};

mongoose.connect(config.database.mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('[Database] Connected')
}).catch((err) => {
  console.log('[Database] Unable to connect to MongoDB Database.\nError: ' + err)
});

export default {
  mongoose: mongoose
};