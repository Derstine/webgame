
function readUserInput(ws, message, deltas, clients, userRef, user) {
    // only input recieved from user is either request for positions or keyboard input

    // user input is expected as 'command|data'
    // keyboard input: 'input|w.d' - client has keys w and d pressed
    // TO DO: USERNAME NEEDS TO BE UPDATED TO A UNIQUE SERVER SIDE GENERATED ID
    // start websocket: 'init|username' - client connects and gives username
    // request for game data: 'request|gamedata' - client needs game data
    try {
        [command, data] = message.split('|');

        if(command == 'input') {
            const speed = 2;

            keys = data.split('.');
            dx = 0;
            dy = 0;

            if (keys.includes('w')) dy--
            if (keys.includes('s')) dy++
            if (keys.includes('d')) dx++;
            if (keys.includes('a')) dx--;

            deltas[user] = [dx * speed, dy * speed];
        } else if(command == 'init') {
            console.log('recieved init with username: ', data)
            // init client on server side
            userRef.user = data;
            clients[data] = [0, 0];
            deltas[data] = [0,0];
            sockets[data] = ws;
            // send client list of clients
            sendGameData(ws, clients);
            // send all clients a new client
            for(let user in sockets) {
                sockets[user].send(`newclient|${data}.${0}.${0}`);
            }
        } else if(command == 'request') {
            console.log('client is requesting data')
        }
        
    } catch {
        return false;
    }
}

function sendGameData(ws, clients) {
    gameDataString = "gamedata|";
    for(let user in clients) {
        gameDataString += `${user}.${clients[user][0]}.${clients[user][1]},`;
    }
    if(gameDataString.endsWith(',')) {
        gameDataString = gameDataString.slice(0, -1);
    }

    ws.send(gameDataString);
}

module.exports = readUserInput;