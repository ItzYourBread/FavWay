const { ShardingManager } = require('discord.js');
const config = require("../config.json");

let manager = new ShardingManager('./index.js', {
    token: config.bot.token,
    totalShards: 1,
    mode: 'process',
    // execArgv: ['--inspect']
});

manager.on('shardCreate', shard => {
    console.log(`[Shard ${shard.id + 1}] Ready!`);
})

manager.spawn();