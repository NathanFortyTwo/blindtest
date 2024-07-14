const express = require('express');
const axios = require('axios');
const path = require('path');
const WebSocket = require('ws');

require('dotenv').config({
    path: '.env'
});

const app = express();
const PORT = process.env.wsport;
const hostname = process.env.hostname
console.log(PORT);
console.log(hostname);

app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(PORT, () => {
    console.log(`HTTP server listening on http://${hostname}:${PORT}`);
});

// WebSocket server
const wss = new WebSocket.Server({
    server
});

// Track which clients are in which rooms
const clients = new Map();
const room_counter = new Map()
const room_id_to_name_list = new Map()
const ws_to_name = new Map()
const API_KEY = process.env.DJANGO_API_KEY

function deleteFilesInRoom(roomName) {
    // Appel à l'API Django pour supprimer les fichiers de la salle
    axios.post('http://localhost:8000/api/delete_files/', {
            room_name: roomName
        }, {
            headers: {
                'X-API-KEY': API_KEY
            }
        })
        .then(response => {
            console.log(`Successfully deleted files for room ${roomName}`);
        })
        .catch(error => {
            console.error(`Error deleting files for room ${roomName}:`, error);
        });
}

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log(data);

            switch (data.type) {
                case 'join':
                    ws_to_name.set(ws, data.name)
                    let room = data.roomid;
                    room = parseInt(room);
                    if (!room_counter.has(room)) {
                        room_counter.set(room, 0);
                        room_id_to_name_list.set(room, []);
                    }
                    let nb_people = room_counter.get(room);
                    room_counter.set(room, nb_people + 1);
                    clients.set(ws, room);
                    console.log(`Client joined room ${room}`);

                    let prev_players = room_id_to_name_list.get(room);
                    prev_players.push(data.name);
                    room_id_to_name_list.set(room, prev_players);
                    let players = room_id_to_name_list.get(room);
                    console.log(players);
                    wss.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN && clients.get(client) === room) {
                            client.send(JSON.stringify({
                                data: {
                                    action: "join",
                                    players: players
                                }
                            }));
                        }
                    });

                    break;

                case 'message':
                    // When a client sends a message
                    const clientRoom = clients.get(ws);
                    if (!clientRoom) {
                        console.error('Client not in a room');
                        return;
                    }

                    // Broadcast to clients in the same room
                    wss.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN && clients.get(client) === clientRoom) {
                            client.send(JSON.stringify({
                                data
                            }));
                        }
                    });
                    break;

                default:
                    console.error('Unknown message type:', );
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    ws.on('close', () => {
        let room_id = clients.get(ws);
        let name = ws_to_name.get(ws);
        let players = room_id_to_name_list.get(room_id);
        let updated_players = players.filter(player => player !== name);

        room_id_to_name_list.set(room_id, updated_players)
        let old_counter = room_counter.get(room_id);
        room_counter.set(room_id, room_id - 1)
        clients.delete(ws);

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN && clients.get(client) === room_id) {
                client.send(JSON.stringify({
                    data: {
                        action: "join",
                        players: updated_players
                    }
                }));
            }
        });

        if (old_counter === 1) {
            deleteFilesInRoom(room_id)
        }
    });
});

console.log('WebSocket server is running');