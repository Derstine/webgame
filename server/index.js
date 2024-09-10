const WebSocket = require('ws');
const readUserInput = require('./userInput')
const wss = new WebSocket.Server({ port: 8080 });

const USER_CAP = 20;

clients = new Map();

wss.on('connection', ws => {
    // send users and locations

    ws.send("TESTING")

    ws.on('message', message => {
        readUserInput(clients, ws, message.toString());
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

setInterval(function() {
    console.log('Loop');

    // recieve all of clients input
    // update clients
    deltasString = 'deltas|'
    for(const user of clients.values()) {
        user.x += user.dx;
        user.y += user.dy;

        deltasString += `${user.username}.${user.dx}.${user.dy},`
    }

    if(deltasString.endsWith(',')) {
        deltasString = deltasString.slice(0, -1);
    }

    // give all clients a list of all users and their deltas
    for(const ws of clients.keys()) {
        ws.send(deltasString);
    }
}, 16);

console.log('websocket server running');