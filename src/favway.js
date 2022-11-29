console.clear();
console.log(
    '                                                                     '
);
console.log(
    '                                                                     '
);
console.log(
    '    ,---,.                               .---.                       '
);
console.log(
    "  ,'  .' |                              /. ./|                       "
);
console.log(
    ",---.'   |                          .--'.  ' ;                       "
);
console.log(
    "|   |   .'               .---.     /__./ \\ : |                       "
);
console.log(
    ":   :  :    ,--.--.    /.  ./| .--'.  '   \\' .  ,--.--.        .--,  "
);
console.log(
    ":   |  |-, /       \\ .-' . ' |/___/ \\ |    ' ' /       \\     /_ ./|  "
);
console.log(
    "|   :  ;/|.--.  .-. /___/ \\: |;   \\  \\;      :.--.  .-. | , ' , ' :  "
);
console.log(
    "|   |   .' \\__\\/: . .   \\  ' . \\   ;  `      | \\__\\/: . ./___/ \\: |  "
);
console.log(
    "'   :  '   ,\" .--.; |\\   \\   '  .   \\    .\\  ; ,\" .--.; | .  \\  ' |  "
);
console.log(
    "|   |  |  /  /  ,.  | \\   \\      \\   \\   ' \\ |/  /  ,.  |  \\  ;   :  "
);
console.log(
    "|   :  \\ ;  :   .'   \\ \\   \\ |    :   '  |--\";  :   .'   \\  \\  \\  ;  "
);
console.log(
    "|   | ,' |  ,     .-./  '---\"      \\   \\ ;   |  ,     .-./   :  \\  \\ "
);
console.log(
    "`----'    `--`---'                  '---\"     `--`---'        \\  ' ; "
);
console.log(
    '                                                               `--`  '
);


import { Client } from 'eris';
import config from './config.json' assert { type: 'json' };
import { readdirSync } from 'fs';
import { colour } from 'printly.js';
import dotenv from 'dotenv';
dotenv.config();

import { ready } from './events/ready.js';
import { shardReady } from './events/shardReady.js';
import { rawWS } from './events/rawWS.js';
import { error } from './events/error.js';
import { interactionCreate } from './events/interactionCreate.js';

import { loadCommands } from './handlers/commands.js';


console.log(colour.blueBright('[System] Index loading...'));
const client = new Client(process.env.TOKEN, {
    restMode: true,
    autoreconnect: true,
    firstShardID: 0,
    lastShardID: 0,
    maxShards: 0,
    allowedMentions: {
        everyone: false,
        users: true,
        roles: true,
    },
    intents: [
        'guilds',
        'guildMessages',
        'guildMembers',
        'messageContent',
        'directMessages',
        'guildEmojis'
    ],
});
export { client };

// Events loader
ready(client);
shardReady(client);
rawWS(client);
error(client);
interactionCreate(client);

// handlers loader
loadCommands(client);

// Database
import './handlers/mongoose.js';
import './server.js';

process.on('unhandledRejection', (reason, promise) => {
    console.log(
        '[FATAL] Possibly Unhandled Rejection at: Promise ',
        promise,
        ' reason: ',
        reason.message
    );
});

client.connect();
console.log(colour.blueBright('[System] Index loaded'));
