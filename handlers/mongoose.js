const mongoose = require('mongoose');
const config = require('../config.json');
const { colour } = require("printly.js");

function println() {
  return console.log.apply(console, arguments)
}

module.exports = async () => {
    mongoose.connect(config.database.mongoDB, {
        useNewUrlParser: true,
        keepAlive: true,
        useUnifiedTopology: true
    }).then(()=>{
        println(colour.green(`\n[Database] Mongoose successfully connected to the server`))
    }).catch((err) =>{
        println(err)
    });
}