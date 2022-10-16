const express = require("express");
const { printly, colour } = require("printly.js");
const path = require("path");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const config = require("./config.json");
let token = "", redirect = "https://favway.subsidised.repl.co/login", discordlogin = "https://discord.com/api/oauth2/token", getUserURL = "https://discord.com/api/users/@me";
require("dotenv").config();

const app = express();

const makeoauthURL = () => {
  return `https://discordapp.com/oauth2/authorize?response_type=code&client_id=${config.bot.clientID}&redirect_uri=${redirect}&scope=identify guilds`;
};

async function getInfo() {
  const getUser = await fetch(getUserURL, {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${token}`
    }
  });
  return await getUser.json();
}


app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  const action = req.query.action || null;
  if (action && action === "login") {
    res.redirect(makeoauthURL());
  } else {
    res.render('index', { error: "" })
  }
})

app.get('/login', async (req, res) => {
  const code = req.query.code || null;
  if (code) {
    const post = await fetch(discordlogin, {
      "method": "POST", headers: {
        "Content-type": "application/x-www-form-urlencoded"
      }, "body": `client_id=${config.bot.clientID}&client_secret=${config.bot.clientSecret}&grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`
    });
    const response = await post.json();
    if (response && response["access_token"]) {
      token = response["access_token"]
      const loginuserinfo = getInfo();
      const avatar = `https://cdn.discordapp.com/avatars/${loginuserinfo.id}/${loginuserinfo.avatar}.png`;
      const user_name = loginuserinfo.username;
      res.render('dashboard', { user: username, img: avatar });
    } else {
      res.render('index', { error: "Invalid Login!.." })
    }
  } else {
    res.render('index', { error: "Error Not Login!.." })
  }
})

app.listen(process.env.PORT, () => {
  printly(colour.green("[Dashboard] FavWay dashboard is online!"));
});