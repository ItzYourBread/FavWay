import { colour } from 'printly.js';

export function rawWS(client) {
    client.on('rawWS', () => {});
    console.log(colour.cyanBright('[Event] rawWS.js is loaded'));
}
