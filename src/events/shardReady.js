import { colour } from 'printly.js';

export function shardReady(client) {
    client.on('shardReady', (id) => {
        console.log(colour.yellowBright(`[Shard] ${id} ready!`));
    });
}
