const express = require('express');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const PORT = 3000;

// Serve the HTML file
app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(PORT, () => {
    console.log(`HTTP server listening on http://localhost:${PORT}`);
});

// WebSocket server
const wss = new WebSocket.Server({
    server
});

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log(data)
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });
});

console.log('WebSocket server is running');