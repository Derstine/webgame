const WebSocket = require('ws');
const readUserInput = require('./userInput')
const wss = new WebSocket.Server({ port: 8080 });

const USER_CAP = 20;
clients = {};
deltas = {};
sockets = {};


wss.on('connection', ws => {
    username = {user: ''};
    // send users and locations

    ws.send("TESTING")

    ws.on('message', message => {
        readUserInput(ws, message.toString(), deltas, clients, username, username.user);
        console.log(clients)
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
    for(user in deltas) {
        clients[user][0] += deltas[user][0];
        clients[user][1] += deltas[user][1];

        deltasString += `${user}.${deltas[user][0]}.${deltas[user][1]},`
    }

    if(deltasString.endsWith(',')) {
        deltasString = deltasString.slice(0, -1);
    }

    // give all clients a list of all users and their deltas
    for(user in sockets) {
        sockets[user].send(deltasString);
    }
}, 20);

console.log('WebSocket server running on ws://localhost:8080');