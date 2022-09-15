const mongoose = require('mongoose');
const config = require('../config.json');
const { printly, colour } = require("printly.js");

module.exports = async () => {
    mongoose.connect(config.database.mongoDB, {
        useNewUrlParser: true,
        keepAlive: true,
        useUnifiedTopology: true
    }).then(()=>{
        printly(colour.green(`\n[Database] Mongoose successfully connected to the server`))
    }).catch((err) =>{
        printly(err)
    });
}