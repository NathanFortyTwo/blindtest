const express = require('express');
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

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log(data)

            switch (data.type) {
                case 'join':
                    let room = data.roomid
                    room = parseInt(room)

                    clients.set(ws, room);
                    console.log(`Client joined room ${room}`);
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
        clients.delete(ws);
    });
});

console.log('WebSocket server is running');