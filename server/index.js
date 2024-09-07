const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const USER_CAP = 20;
clients = {};
sockets = {};

wss.on('connection', ws => {
    username = "";
    // send users and locations

    ws.on('message', message => {
        messageObj = JSON.parse(message);

        if(messageObj.command) {
            if(messageObj.command === "initWs" && messageObj.data) {
                // init client on server side
                username = messageObj.data;
                clients[username] = {position: {x: 0, y: 0}, input: {w: false, a: false, s: false, d: false}};
                sockets[username] = ws;
                // send client list of clients
                ws.send(JSON.stringify({"command": "init", "data": clients}))
            } else if(messageObj.command === "moveRight") {
                clients[username].x += 50;
                console.log(clients)
            } else if(messageObj.command === "reqLoc") {
                ws.send(JSON.stringify(clients))
            }
        } else if(messageObj.input) {
            if(messageObj.input.w === true) {
                clients[username].input.w = true;
            } else if(messageObj.input.s === true) {
                clients[username].input.s = true;
            }
        }
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
    deltas = {};
    for(user in clients) {
        console.log(user);
        if(clients[user].input.w === true) {
            clients[user].position.x += 1;
            deltas[user] = {"dx": 1};
        }
    }

    // give all clients a list of all users and their deltas
    for(user in sockets) {
        sockets[user].send(JSON.stringify({command: "update", data: deltas}));
    }
}, 1000);

console.log('WebSocket server running on ws://localhost:8080');