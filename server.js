const express = require("express");
const { printly, colour } = require("printly.js");
const path = require("path");
const bodyParser = require("body-parser");

require("dotenv").config;

const app = express();

app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(process.env.PORT, () => {
  printly(colour.green("[Dashboard] FavWay dashboard is online!"));
});