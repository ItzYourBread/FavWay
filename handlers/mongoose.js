const mongoose = require('mongoose');
const config = require('../config.json');
const chalk = require("chalk");

module.exports = async () => {
    mongoose.connect(config.database.mongoDB, {
        useNewUrlParser: true,
        keepAlive: true,
        useUnifiedTopology: true
    }).then(()=>{
        console.log(chalk.green(`\n[Database] Mongoose successfully connected to the server`))
    }).catch((err) =>{
        console.log(err)
    });
}