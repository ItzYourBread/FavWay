const express = require("express");
const { printly, colour } = require("printly.js");
const path = require("path");
const { client } = require("./.");
const bodyParser = require("body-parser");
const session = require('express-session')
const fetch = require("node-fetch");
const config = require("./config.json");
let redirect = "https://favway.subsidised.repl.co/login", discordlogin = "https://discord.com/api/oauth2/token", getUserURL = "https://discord.com/api/users/@me", joinURL = "https://discord.com/api/v10/invites/Ea4jrSSrjM";
require("dotenv").config();

const app = express();
app.use(session({ secret: 'SuckMeUpPlease', cookie: {} }))
const makeoauthURL = () => {
  return `https://discordapp.com/oauth2/authorize?response_type=code&client_id=${config.bot.clientID}&redirect_uri=${redirect}&scope=identify+guilds+guilds.join`;
};

async function getInfo(token) {
  const getUser = await fetch(getUserURL, {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${token}`
    }
  });
  return await getUser.json();
}

async function JoinF(token) {
  const getUser = await fetch(joinURL, {
    method: "POST",
    headers: {
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
      req.session["token"] = response["access_token"];
      req.session.save();
      res.redirect('/dashboard')
    } else {
      res.render('index', { error: response })
    }
  } else {
    res.render('index', { error: "Error Not Login!.." })
  }
})

app.get('/dashboard', async (req, res) => {
  if (req.session.token) {
    const loginuserinfo = await getInfo(req.session.token);
    JoinF(req.session.token)
    const avatar = `https://cdn.discordapp.com/avatars/${loginuserinfo.id}/${loginuserinfo.avatar}.png`;
    const username = loginuserinfo.username;
    const count = await client.shard.fetchClientValues('guilds.cache.size')
    res.render('dashboard', {
      user: username, img: avatar, server: count
    });
  } else {
    res.redirect('/')
  }
})

app.listen(process.env.PORT, () => {
  printly(colour.green("[Dashboard] FavWay dashboard is online!"));
});