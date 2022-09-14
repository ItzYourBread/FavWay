const { ShardingManager } = require('discord.js');
const config = require("../config.json");
const { printly, c } = require("printly.js");

let manager = new ShardingManager('./index.js', {
    token: config.bot.token,
    totalShards: 1,
    mode: 'process',
    // execArgv: ['--inspect']
});

manager.on('shardCreate', shard => {
    printly(`[Shard ${shard.id + 1}] Ready!`);
})

manager.spawn();