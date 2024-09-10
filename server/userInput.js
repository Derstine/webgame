
function readUserInput(clients, ws, message) {
    // only input recieved from user is either request for positions or keyboard input

    // user input is expected as 'command|data'
    // keyboard input: 'input|w.d' - client has keys w and d pressed
    // TO DO: USERNAME NEEDS TO BE UPDATED TO A UNIQUE SERVER SIDE GENERATED ID
    // start websocket: 'init|username.color' - client connects and gives username
    // request for game data: 'request|gamedata' - client needs game data
    try {
        [command, data] = message.split('|');

        if(command == 'input') {
            console.log('input: ', data)
            const speed = 2;

            keys = data.split('.');
            dx = 0;
            dy = 0;

            if (keys.includes('w')) dy--;
            if (keys.includes('s')) dy++;
            if (keys.includes('d')) dx++;
            if (keys.includes('a')) dx--;

            client = clients.get(ws);
            client.dx = dx * speed;
            client.dy = dy * speed;
            clients.set(ws, client);
            console.log('client: ', clients.get(ws))
        } else if(command == 'init') {
            [user, color] = data.split('.');
            console.log('recieved init with username: ', data)
            // init client on server side
            clients.set(ws, {username: user, color: color, x: 0, y: 0, dx: 0, dy: 0})
            // send client list of clients
            sendGameData(ws, clients);
            // send all clients a new client to add
            for (const ws of clients.keys()) {
                ws.send(`newclient|${user}.${color}.${0}.${0}`);
            }     
        } else if(command == 'request') {
            console.log('client is requesting data')
        }
        
    } catch {
        return false;
    }
}

function sendGameData(ws, clients) {
    // "gamedata|user1.color.x.y|user2.color.x.y|etc"
    gameDataString = "gamedata|";
    for (const user of clients.values()) {
        gameDataString += `${user.username}.${user.color}.${user.x}.${user.y},`;
    }   
    if(gameDataString.endsWith(',')) {
        gameDataString = gameDataString.slice(0, -1);
    }

    ws.send(gameDataString);
}

module.exports = readUserInput;